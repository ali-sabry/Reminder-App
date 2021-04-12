const set_btn = document.getElementById("set_btn"),
    add_btn = document.getElementById("add_btn"),
    reminder_fill = document.querySelector(".reminder_fill"),
    message = document.querySelector(".message"),
    date = document.getElementById("date"),
    time = document.getElementById("time"),
    title = document.getElementById("title"),
    subject = document.getElementById("subject"),
    result = document.querySelector(".result"),
    theItems = localStorage.getItem("items");
function createdReminderBox() {
    const e = document.createElement("div"),
        t = document.createElement("div"),
        n = document.createElement("h3"),
        l = document.createElement("p"),
        a = document.createElement("div"),
        o = document.createElement("span"),
        c = document.createElement("span"),
        r = document.createElement("span");
    (e.className = "reminder_card"),
        (t.className = "col-12 col-md-6"),
        (n.className = "card_title"),
        (l.className = "card_subject"),
        (a.className = "card_option"),
        (o.className = "card_date"),
        (c.className = "card_time"),
        (r.className = "card_delete"),
        (o.textContent = new Date(date.valueAsNumber).toLocaleDateString());
    let d = time.valueAsNumber - 72e5;
    (c.textContent = new Date(d).toLocaleTimeString()),
        (n.textContent = title.value),
        (l.textContent = subject.value),
        e.appendChild(n),
        e.appendChild(l),
        a.appendChild(o),
        a.appendChild(c),
        a.appendChild(r),
        e.appendChild(a),
        storeMS(e),
        result.prepend(e);
}
function saveCreated() {
    0 !== result.childElementCount && localStorage.setItem("items", result.innerHTML);
}
(add_btn.onclick = () => {
    date.value && time.value && "" !== title.value
        ? (createdReminderBox(), saveCreated(), (message.textContent = "sucsess"), (add_btn.parentElement.style.display = "none"), window.location.reload())
        : ((message.textContent = "Sorry Input Cant Be Empty"),
          Array.from(document.getElementsByTagName("input")).forEach((e) => {
              e.onfocus = () => {
                  message.textContent = "";
              };
          }));
}),
    (set_btn.onclick = () => {
        reminder_fill.classList.toggle("opened");
    }),
    (result.innerHTML = theItems);
const deleteBtn = document.querySelectorAll(".card_delete");
deleteBtn.forEach((e) => {
    e.addEventListener("click", (e) => {
        e.target.parentElement.parentElement.remove(), localStorage.setItem("items", result.innerHTML), window.location.reload();
    });
});
let tabs = document.querySelectorAll(".tabs span"),
    countNum = document.querySelector(".count"),
    otherTasks = document.querySelectorAll(".reminder_card"),
    completedTask = document.querySelectorAll(".completed");
function notifyMe(e, t) {
    function n() {
        let n = new Notification(`${e}`, { icon: "../img/favicon.png", body: `${t}` });
        (n.onclick = () => {
            window.open("index.html");
        }),
            setTimeout(n.close.bind(n), 7e3);
    }
    "Notification" in window
        ? "granted" === Notification.permission
            ? n()
            : "denied" !== Notification.permission &&
              Notification.requestPermission((e) => {
                  "granted" === e && n();
              })
        : alert("This Browser Not Support");
}
function storeMS(e) {
    let t = time.valueAsNumber - 72e5 + date.valueAsNumber,
        n = new Date(),
        l = t - new Date(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), 0),
        a = document.createElement("span"),
        o = document.createTextNode(l);
    a.appendChild(o), e.appendChild(a), (a.className = "dif_time"), l < 0 && (alert("Invaild Date"), (a.textContent = 0));
}
if (
    (tabs.forEach((e) => {
        e.classList.contains("all") && e.classList.add("active"),
            (countNum.textContent = `All: ${result.childElementCount}`),
            e.addEventListener("click", (t) => {
                e.parentElement.querySelectorAll(".active").forEach((e) => {
                    e.classList.remove("active");
                }),
                    t.target.classList.add("active"),
                    (function () {
                        let t = document.querySelectorAll(".reminder_card"),
                            n = document.querySelectorAll(".completed");
                        e.classList.contains("all")
                            ? (n.forEach((e) => (e.style.display = "block")), t.forEach((e) => (e.style.display = "block")), (countNum.textContent = `All: ${result.childElementCount}`))
                            : e.classList.contains("completed_btn")
                            ? (t.forEach((e) => (e.style.display = "none")), n.forEach((e) => (e.style.display = "block")), (countNum.textContent = `completed: ${n.length}`))
                            : ((result.innerHTML = ""), localStorage.removeItem("items"), window.location.reload());
                    })();
            });
    }),
    "" !== result.innerHTML)
) {
    let e = document.querySelectorAll(".dif_time"),
        t = new Audio("Sound/classic-alarm-2.mp3");
    e.forEach(function (e) {
        let n = parseInt(e.textContent);
        setTimeout(() => {
            notifyMe(e.parentElement.querySelector(".card_title").textContent, e.parentElement.querySelector(".card_subject").textContent),
                e.parentElement.classList.add("completed"),
                e.remove(),
                t.play(),
                localStorage.setItem("items", result.innerHTML);
        }, n);
    });
}
