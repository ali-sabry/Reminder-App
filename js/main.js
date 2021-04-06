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
    const result        = document.querySelector(".result");
    const theItems      = localStorage.getItem("items");
  /** *********** End Set The Main letibiles ********** */

  /** *********** Start Add Button Function ********** */
    add_btn.onclick = () => {
      // Check If The Input Is Empty
      if (date.value && time.value && title.value !== "") {
        createdReminderBox();
        saveCreated();
        message.textContent = "sucsess";
        add_btn.parentElement.style.display = "none";
        window.location.reload();
      } else {
        message.textContent = "Sorry Input Cant Be Empty";
        Array.from(document.getElementsByTagName("input")).forEach( (element) => {
          element.onfocus = () =>  {
            message.textContent = "";
          };
        });
      };
    };
    // Show The Reminder Fill
    set_btn.onclick = () => {
      reminder_fill.classList.toggle("opened");
    };
  /** *********** End Add Button Function ********** */

  /** ************* Start The Function Created The Reminder Card ************* */
    function createdReminderBox() {
      const card = document.createElement("div");
      const theCol = document.createElement("div");
      const cardTitle = document.createElement("h3");
      const cardSubject = document.createElement("p");
      const cardOption = document.createElement("div");
      const cardDate = document.createElement("span");
      const cardTime = document.createElement("span");
      const cardDel = document.createElement("span");
     
      // Set The ClassName
        card.className = "reminder_card";
        theCol.className = "col-12 col-md-6";
        cardTitle.className = "card_title";
        cardSubject.className = "card_subject";
        cardOption.className = "card_option";
        cardDate.className = "card_date";
        cardTime.className = "card_time";
        cardDel.className = "card_delete";
      /* Set The TextContent Of Reminder card And Delete Icon */

        // card Date
        cardDate.textContent = new Date(date.valueAsNumber).toLocaleDateString();

        // This let To Decresse Two Hour From Time
          let setVal = time.valueAsNumber - 7200000;
        // Set Card Time Value
          cardTime.textContent = new Date(setVal).toLocaleTimeString();

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

        // Function  Store The Milli Second Of Every Card
          storeMS(card);

        // Append The Parent Of card To The Result Body
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

  /** ************************** Start Tabs Buttons Funvtion ******************************************* */

    // Search Of The Cards The Completed Task And Other
    let tabs = document.querySelectorAll('.tabs span'),
        countNum = document.querySelector('.count'),
        otherTasks = document.querySelectorAll('.reminder_card'),
        completedTask = document.querySelectorAll('.completed');

    tabs.forEach((button) => {
      // FThis Function Set Every Tabs Button Job
      function tabsBtn() {
        let other = document.querySelectorAll('.reminder_card'),
            completed = document.querySelectorAll('.completed');
          if (button.classList.contains('all')) {
            completed.forEach((compTask) => compTask.style.display = 'block');
            other.forEach((otherTask) => otherTask.style.display = 'block');
            countNum.textContent = `All: ${result.childElementCount}`;
          } else if (button.classList.contains('completed_btn')) {
            other.forEach((otherTask) => otherTask.style.display = "none");
            completed.forEach((compTask) => compTask.style.display = "block");
            countNum.textContent = `completed: ${completed.length}`;
          } else {
            result.innerHTML = "";
            localStorage.removeItem("items");
            window.location.reload();
          }
      };

      // This Statement Set All Button As Default
      if (button.classList.contains('all')) button.classList.add('active');

      // Set The Count Message
      countNum.textContent = `All: ${result.childElementCount}`;

      // Click Buttons Statements
      button.addEventListener('click', (event) => {

        // Remove Active Class
        button.parentElement.querySelectorAll('.active').forEach(element => {
          element.classList.remove('active');
        });

        // Add Active
        event.target.classList.add('active');
        
        // Run The Function
        tabsBtn();

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
          icon: "../img/favicon.png",
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

        // Create Span And Text
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

    // This Statement Run The Cards Notiification And Sound
    if (result.innerHTML !== "") {
      // All Spans Contains Millisecond Of Cards
      let theSpans = document.querySelectorAll(".dif_time");
      // Set The Sound Source
      let theSound = new Audio("Sound/classic-alarm-2.mp3");

      theSpans.forEach(function (element) {
        let spanMs = parseInt(element.textContent);
        setTimeout(() => {
          let notiTitle = element.parentElement.querySelector(".card_title").textContent;
          let notiSubject = element.parentElement.querySelector(".card_subject").textContent;
          notifyMe(notiTitle, notiSubject);
          element.parentElement.classList.add("completed");
          element.remove();
          theSound.play();
          localStorage.setItem("items", result.innerHTML);
        }, spanMs);
      });
    };
  /** ************************** End Finlize Reminder Notification And Sound ******************************************* */
  
/** ****************************
    End The Reminder App
********************************** */


