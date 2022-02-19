/** ****************************
    Start The Reminder App
********************************** */

  /** *********** Start Set The Main varibiles ********** */
    const set_btn       = document.getElementById("set_btn");
    const add_btn       = document.getElementById("add_btn");
    const reminder_fill = document.querySelector(".reminder_fill");
    const message       = document.querySelector(".message");
    const date          = document.getElementById("date");
    const time          = document.getElementById("time");
    const title         = document.getElementById("title");
    const subject       = document.getElementById("subject");
    const result        = document.querySelector(".result .row");
    const theItems      = localStorage.getItem("items");
    const tabs          = document.querySelectorAll('.tabs span');
    const countNum      = document.querySelector('.count');
  /** *********** End Set The Main letibiles ********** */

  /** *********** Start Add Button Function ********** */
    // Show & Hide The Reminder Fill
    set_btn.onclick = () => {
      reminder_fill.classList.toggle("opened");
    };

    // Fill The Input & Create Reminder Card
    add_btn.onclick = () => {
      // Check If The Input's Is Not Empty
      if (date.value && time.value && title.value !== "") {
        createdReminderBox();
        saveCreated();
        message.textContent = "sucsess";
        add_btn.parentElement.style.display = "none";
        window.location.reload();
      } else { // Print Message To Fill Input's
        message.textContent = "Sorry Input's Can't Be Empty";
        Array.from(document.getElementsByTagName("input")).forEach( (element) => {
          element.onfocus = () =>  {
            message.textContent = "";
          };
        });
      };
    };
   
  /** *********** End Add Button Function ********** */

  /** ************* Start The Function Created The Reminder Card ************* */
    function createdReminderBox() {
      const card          = document.createElement("div");
      const cardTitle     = document.createElement("h3");
      const cardSubject   = document.createElement("p");
      const cardOption    = document.createElement("div");
      const cardDate      = document.createElement("span");
      const cardTime      = document.createElement("span");
      const cardDel       = document.createElement("span");
      const setTimeVal    = time.valueAsNumber - 7200000; // This Var To Decresse Two Hour From Time

      // Set The Classes Name
        card.className         = "reminder_card col-md-5";
        cardTitle.className    = "card_title";
        cardSubject.className  = "card_subject";
        cardOption.className   = "card_option";
        cardDate.className     = "card_date";
        cardTime.className     = "card_time";
        cardDel.className      = "card_delete";

      /* Set The TextContent Of Reminder card And Delete Icon */

        // card Date
          cardDate.textContent = new Date(date.valueAsNumber).toLocaleDateString();

        // Set Card Time Value
          cardTime.textContent = new Date(setTimeVal).toLocaleTimeString();

        // card Head
          cardTitle.textContent = title.value;

        // card Info
          cardSubject.textContent = subject.value;

      /* Append The All Data */

        // Append The Data To The Parent Of card
          card.appendChild(cardTitle);
          card.appendChild(cardSubject);
          cardOption.appendChild(cardDate);
          cardOption.appendChild(cardTime);
          cardOption.appendChild(cardDel);
          card.appendChild(cardOption);

        // Function Store The Milli Second Of Every Card
          storeMS(card);

        // Append Card To The Result Body
          result.prepend(card);
    };
  /** ************* End The Function Created The Reminder card ************* */

  /** ************* Start The Function Saving the Created card ************* */
    function saveCreated() {
      // Saving The Elements Inside The Result Div
      if (result.childElementCount !== 0) localStorage.setItem("items", result.innerHTML);
    };
    // Adding The Saved Elements To The Result Div
    result.innerHTML = theItems;
  /** ************* End The Function Saving the Created card ************* */

  /** ************* Start The Function Removing The card ************* */
    const deleteBtn = document.querySelectorAll(".card_delete");
    // Loop Of Buttons
    deleteBtn.forEach((button) => {
      button.addEventListener("click", (btn) => {
        // Remove The Current Card
        btn.target.parentElement.parentElement.remove();
        // Reset The Result Children After Deleting
        localStorage.setItem("items", result.innerHTML);
        // Refresh Page
        window.location.reload();
      });
    });
  /** ************* End The Function Removing The card ************* */

  /** ************************** Start Function Hide & Show Cards  ******************************************* */      
        // This Function Set Every Tabs Button Job
        function tabsBtn(e) {
            let t = document.querySelectorAll(".reminder_card"), // All Reminders
                n = document.querySelectorAll(".completed"); // Completed Reminders
            e.classList.contains("all") // Show All Boxes
            ? (n.forEach((e) => (e.style.display = "block")), t.forEach((e) => (e.style.display = "block")),(set_btn.style.cssText = `opacity: 1; pointer-events: all`), (countNum.textContent = `All: ${result.childElementCount}`))
            : e.classList.contains("completed_btn") // Show Completed Boxes
            ? (t.forEach((e) => (e.style.display = "none")), n.forEach((e) => (e.style.display = "block")), (set_btn.style.cssText = `opacity: 0; pointer-events: none`), (countNum.textContent = `completed: ${n.length}`))
            : ((result.innerHTML = ""), localStorage.removeItem("items"), window.location.reload());
        };
  /** ************************** End Function Hide & Show Cards ******************************************* */

  /** ************************** Start Tabs Buttons Function ******************************************* */

    tabs.forEach((e) => {
    
      // This Statement Set All Button As Default
      if (e.classList.contains('all')) e.classList.add('active');

      // Set The Count Message
      countNum.textContent = `All: ${result.childElementCount}`;

      // Click Buttons Statements
      e.addEventListener('click', (event) => {

        // Remove Active Class
        e.parentElement.querySelectorAll('.active').forEach(element => {
          element.classList.remove('active');
        });

        // Add Active
        event.target.classList.add('active');
        
        // Run The Function
        tabsBtn(e);

      });
    });

  /** ************************** End Tabs Buttons Funvtion ******************************************* */

  /** ************************** Start Notification ******************************************* */
    function notifyMe(nTiltle, nSubject) {
      // Check For Notification Permission
      if (!("Notification" in window)) {
        alert("This Browser Not Support");
      } else if (Notification.permission === "granted") {
        notify();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission((permission) => {
          if (permission === "granted") {
            notify();
          };
        });
      };
      // Notification Message
      function notify() {
        let notifyMessage = new Notification(`${nTiltle}`, {
          icon: "../img/favicon.svg",
          body: `${nSubject}`
        });

        notifyMessage.onclick = () => {
          window.open("index.html");
        };
        // Hide Notify After some Milli Seconds
        setTimeout(notifyMessage.close.bind(notifyMessage), 7000);
      };
    };
  /** ************************** End Notification ******************************************* */

  /** ************************** Start Finlize Reminder Notification And Sound ******************************************* */

    // Creating The Span Created And Store Different Time
    function storeMS(element) {
      // Get The Real MilliSecond From Input Time And Decrease 2 Hours
        let futDate = time.valueAsNumber - 7200000 + date.valueAsNumber,
        // Set NeW Date
          d = new Date(),
        // Set Value Of The New Date
          currentDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0),
        // The Diffrent Time Between Current And Selected time
          dif = futDate - currentDate,

        // Span Contain Diffrent Time Between Current & Selected Time
          theSpan = document.createElement("span"),
          spanText = document.createTextNode(dif);

      // Append Text Span To span
        theSpan.appendChild(spanText);
        element.appendChild(theSpan);

      // Set ClassName
        theSpan.className = "dif_time";

      // Check The Invaild D
        if (dif < 0) {
          alert("Invaild Date");
          theSpan.textContent = 0;
        };
    };

    // This Statement Run The Cards Notification And Sound
    if (result.innerHTML !== "") {
      // All Spans Contains Millisecond Of Cards
      let theSpans = document.querySelectorAll(".dif_time");
      // Set The Sound Source
      let theSound = new Audio("Sound/classic-alarm-2.mp3");
      // Looping All Span Contain Diffrent Time Between Current & Selected Time
      theSpans.forEach(function (element) {
        let spanMs = parseInt(element.textContent);
        setTimeout(() => {
          // Set Title & Subject On Notification Body From Exist Reminder
          let notiTitle = element.parentElement.querySelector(".card_title").textContent;
          let notiSubject = element.parentElement.querySelector(".card_subject").textContent;
          // Set arguments On Notification
          notifyMe(notiTitle, notiSubject);
          // Set Completed Class Name On Finished Task Card
          element.parentElement.classList.add("completed");
          // Remove Exist Span Contain Diffrent Time
          element.remove();
          // Play The Sound
          theSound.play();
          // Cach Other Reminders On Localstorage
          localStorage.setItem("items", result.innerHTML);
        }, spanMs);
      });
    };
  /** ************************** End Finlize Reminder Notification And Sound ******************************************* */
  
/** ****************************
    End The Reminder App
********************************** */


