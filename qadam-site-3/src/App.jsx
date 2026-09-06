import React, { useEffect, useMemo, useState } from "react";

const topics = [
  { id: "intro", icon: "🍕", title: "Что такое дробь", text: "Числитель — сколько частей взяли, знаменатель — на сколько частей разделили целое." },
  { id: "comparing", icon: "⚖️", title: "Сравнение дробей", text: "Сравниваем дроби с одинаковыми знаменателями или приводим к общему знаменателю." },
  { id: "simplifying", icon: "✂️", title: "Сокращение дробей", text: "Делим числитель и знаменатель на их общий делитель." },
  { id: "common_denominator", icon: "🔗", title: "Общий знаменатель", text: "Приводим дроби к одному знаменателю." },
  { id: "add_sub", icon: "➕", title: "Сложение и вычитание", text: "Сначала общий знаменатель, затем складываем или вычитаем числители." },
  { id: "multiply", icon: "✖️", title: "Умножение дробей", text: "Числитель на числитель, знаменатель на знаменатель." },
  { id: "divide", icon: "➗", title: "Деление дробей", text: "Умножаем на дробь, обратную делителю." },
];

const exercises = [
  { topic:"intro", q:"Пирог разделили на 6 равных частей. Взяли 2 части. Какая дробь?", a:"2/6", options:["2/6","6/2","4/6","2/4"], xp:5 },
  { topic:"intro", q:"Что показывает знаменатель дроби?", a:"На сколько частей разделили целое", options:["Сколько частей взяли","На сколько частей разделили целое","Сумму числителя и знаменателя"], xp:5 },
  { topic:"comparing", q:"Сравни: 3/7 и 5/7", a:"3/7 < 5/7", options:["3/7 > 5/7","3/7 < 5/7","3/7 = 5/7"], xp:5 },
  { topic:"comparing", q:"Какая дробь ближе всего к 1?", a:"5/6", options:["5/6","2/3","1/2","3/8"], xp:10 },
  { topic:"simplifying", q:"Сократи дробь 12/18", a:"2/3", options:["2/3","3/4","6/9","1/2"], xp:10 },
  { topic:"common_denominator", q:"Общий знаменатель для 1/4 и 1/6:", a:"12", options:["10","12","24","6"], xp:10 },
  { topic:"add_sub", q:"1/2 + 1/3 = ?", a:"5/6", options:["2/5","5/6","2/6","1"], xp:10 },
  { topic:"multiply", q:"2/3 × 3/4 = ?", a:"1/2", options:["1/2","2/7","6/12","3/4"], xp:10 },
  { topic:"divide", q:"1/2 ÷ 1/4 = ?", a:"2", options:["1/8","1/2","2","4"], xp:10 },
];

function load() {
  try { return JSON.parse(localStorage.getItem("qadam_progress_v1")) || { xp:0, solved:0, correct:0, name:"" }; }
  catch { return { xp:0, solved:0, correct:0, name:"" }; }
}

export default function App() {
  const [state, setState] = useState(load);
  const [page, setPage] = useState("home");
  const [topic, setTopic] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => localStorage.setItem("qadam_progress_v1", JSON.stringify(state)), [state]);

  const level = useMemo(() => {
    if (state.xp >= 1000) return "Претендент NISH";
    if (state.xp >= 700) return "Мастер дробей";
    if (state.xp >= 450) return "Решатель задач";
    if (state.xp >= 250) return "Боец дробей";
    if (state.xp >= 100) return "Исследователь";
    return "Новичок";
  }, [state.xp]);

  const pool = useMemo(() => topic ? exercises.filter(x => x.topic === topic) : exercises, [topic]);
  const ex = pool[index % Math.max(pool.length,1)];

  function start(id) {
    setTopic(id);
    setIndex(0);
    setAnswer("");
    setResult(null);
    setPage("practice");
  }

  function check() {
    if (!answer) return;
    const correct = answer === ex.a;
    setResult(correct);
    setState(s => ({ ...s, solved:s.solved+1, correct:s.correct+(correct?1:0), xp:s.xp+(correct?ex.xp:0) }));
  }

  function next() {
    setIndex(i => i + 1);
    setAnswer("");
    setResult(null);
  }

  const styles = {
    root:{minHeight:"100vh",background:"#f6f5fb",color:"#181c3a",fontFamily:"Inter,Arial,sans-serif"},
    top:{background:"#141a3d",color:"#fff",padding:"16px max(20px,calc((100vw - 1100px)/2))",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,position:"sticky",top:0},
    wrap:{maxWidth:1100,margin:"0 auto",padding:24},
    card:{background:"#fff",border:"1px solid #e4e2f3",borderRadius:22,padding:22,boxShadow:"0 8px 24px -12px rgba(15,19,48,.18)"},
    btn:{border:0,borderRadius:14,padding:"13px 18px",fontWeight:700,cursor:"pointer",fontSize:15},
  };

  return <div style={styles.root}>
    <header style={styles.top}>
      <div><b style={{fontSize:24}}>QADAM</b><span style={{opacity:.7,marginLeft:10}}>Математика шаг за шагом</span></div>
      <div>⚡ {state.xp} XP · {level}</div>
    </header>

    <main style={styles.wrap}>
      {page === "home" && <>
        <section style={{...styles.card,marginBottom:22,padding:32}}>
          <div style={{fontSize:42}}>👋</div>
          <h1 style={{fontSize:36,margin:"10px 0"}}>Добро пожаловать в QADAM</h1>
          <p style={{fontSize:18,color:"#6b6f95"}}>Изучай дроби маленькими уверенными шагами.</p>
          <button style={{...styles.btn,background:"#12b8a6",marginTop:10}} onClick={()=>setPage("topics")}>Начать обучение →</button>
        </section>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16}}>
          <div style={styles.card}>🏆<h3>{state.solved} задач решено</h3></div>
          <div style={styles.card}>🎯<h3>{state.correct} правильных</h3></div>
          <div style={styles.card}>⚡<h3>{state.xp} XP</h3></div>
        </div>
      </>}

      {page === "topics" && <>
        <h1>Выбери тему</h1>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
          {topics.map(t => <button key={t.id} onClick={()=>start(t.id)} style={{...styles.card,textAlign:"left",cursor:"pointer",fontSize:16}}>
            <div style={{fontSize:32}}>{t.icon}</div><h2>{t.title}</h2><p style={{color:"#6b6f95"}}>{t.text}</p>
            <b>Начать →</b>
          </button>)}
        </div>
        <button style={{...styles.btn,marginTop:20,background:"#e4e2f3"}} onClick={()=>setPage("home")}>← Назад</button>
      </>}

      {page === "practice" && ex && <>
        <button style={{...styles.btn,background:"#e4e2f3",marginBottom:18}} onClick={()=>setPage("topics")}>← К темам</button>
        <div style={{...styles.card,maxWidth:700,margin:"0 auto"}}>
          <div style={{color:"#6a5cf0",fontWeight:700}}>Задача {index+1} · +{ex.xp} XP</div>
          <h2 style={{fontSize:26}}>{ex.q}</h2>
          <div style={{display:"grid",gap:10}}>
            {ex.options.map(o => <button key={o} disabled={result!==null} onClick={()=>setAnswer(o)}
              style={{...styles.btn,textAlign:"left",background: answer===o ? "#141a3d" : "#fff",color:answer===o?"#fff":"#181c3a",border:"2px solid #e4e2f3"}}>
              {o}
            </button>)}
          </div>
          {result===null ? <button style={{...styles.btn,background:"#12b8a6",marginTop:18,width:"100%"}} onClick={check} disabled={!answer}>Проверить</button> :
            <div style={{marginTop:18}}>
              <div style={{padding:16,borderRadius:14,background:result?"#e7f8ef":"#fdebea"}}>
                <b>{result ? "🎉 Правильно!" : `🤔 Неверно. Правильный ответ: ${ex.a}`}</b>
                {result && <span> +{ex.xp} XP</span>}
              </div>
              <button style={{...styles.btn,background:"#141a3d",color:"#fff",marginTop:14,width:"100%"}} onClick={next}>Следующая задача →</button>
            </div>}
        </div>
      </>}

      <footer style={{marginTop:40,textAlign:"center",color:"#6b6f95"}}>
        <button style={{...styles.btn,background:"transparent"}} onClick={()=>setPage("home")}>Главная</button>
        <button style={{...styles.btn,background:"transparent"}} onClick={()=>setPage("topics")}>Уроки</button>
      </footer>
    </main>
  </div>;
}
