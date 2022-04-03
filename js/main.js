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
    let timeout;
  /** *********** End Set The Main letibiles ********** **/ 

  /** *********** Start Toggled The Reminder Fill Panel ********** **/
    set_btn.onclick = () => {
      reminder_fill.classList.toggle("opened");
    };
  /** *********** End Toggled The Reminder Fill Panel ********** **/
  
  /** *********** Start Function Validation Date & Time *********** **/
    function timeDateHandler(inputs) {
      //==== Get The Real MilliSecond From Input Time And Decrease 2 Hours + Selected Date Milli Seconds
      let selected;       
      //==== Set NeW Date
      let theDate = new Date();
      //==== Set Value Of The New Date
      let currentDate = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate(), 0, 0, 0);
      let fullTimeWithoutSecond = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate(), theDate.getHours(), theDate.getMinutes(), 0);
      let currentTime = fullTimeWithoutSecond - currentDate;
      inputs.addEventListener('change', ()=> {
        selected = inputs.valueAsNumber;
        //======= Date Validation .
        if (inputs === date) {
          if( (selected - currentDate) < 0) {
            message.textContent = 'Invaild Date'
            inputs.value = '';
            inputs.blur();
            inputs.onclick = () => {
              message.textContent = '';
            }
          };
        } else if (inputs === time) { //======== Time Validation .
          if ( (selected - currentTime ) < 0) {
            message.textContent = 'Invaild Time';
            inputs.value = '';
            inputs.blur();
            inputs.onclick = () => {
              message.textContent = '';
            };
          };
        };
      });
    };
    timeDateHandler(date); timeDateHandler(time);
  /** *********** End Function Validation Date & Time *********** **/

  /** *********** Start Add Button Handler Function ********** **/
    (function addBtnHandler() {      
      add_btn.addEventListener('click', ()=> {
        //===== Check If The Input's Is Not Empty
        if (date.value && time.value && title.value !== "") {
          //===== Run Created Box Function
            createdReminderBox();
          //====== Run Function Handler The Notifition To Every Reminder .  
            handlerAllStoredNotification();
          //==== Toggled The Form .
            reminder_fill.classList.toggle("opened");
          //===== Empty All Inputs .
            Array.from(reminder_fill.querySelectorAll('input')).map((field)=> {
              field.value = '';
            });
          //======= Empty The Textarea .  
            subject.value = '';
        } else {
          //====== Show Error Message To Fill Input's
          message.textContent = "Sorry Input's Can't Be Empty";
          //====== Hide The Error Message On Focus At Input's OR Textarea
          Array.from(document.getElementsByTagName("input")).forEach( (element) => {
            element.onfocus = () =>  {
              message.textContent = "";
            };
          });
        };
      });
    }());
  /** *********** End Add Button Handler Function ********** **/

  /** ************* Start The Function Created The Reminder Card ************* **/
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
          cardDate.innerHTML = `<pre>${new Date(date.valueAsNumber).toLocaleDateString()}<pre/>`;

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
        
        // Run Saved Created Function
          saveCreated();

        // Run Delete Card Function
          removeCard()
    };
  /** ************* End The Function Created The Reminder card ************* **/

  /** ************* Start The Function Saving the Created card ************* **/
    function saveCreated() {
      //====== Run Handler All Stored Notification Function .
      handlerAllStoredNotification();
      //==== Saving Created Reminders To Local Storage .
      localStorage.setItem("items", result.innerHTML);
      //==== Set The Count Reminders .
      countNum.textContent = `All: ${result.childElementCount}`;
    };
  /** ************* End The Function Saving the Created card ************* **/

  /** ************* Start Add All Saved Reminders To Result Container ************* **/
    result.innerHTML = theItems;
  /** ************* End Add All Saved Reminders To Result Container ************* **/

  /** ************* Start The Function Removing The card ************* **/
    function removeCard() {
      //===== Loop Of Buttons
        Array.from(document.querySelectorAll(".card_delete")).map((button) => {
          button.addEventListener("click", (btn) => {
            //==== Remove The Current Card
            btn.target.parentElement.parentElement.remove();
            //==== Reset The Result Children After Deleting
            saveCreated();
          });
        });
    };
    removeCard();
  /** ************* End The Function Removing The card ************* **/

  /** ********** Start Function Handler Show All Reminders & Completed ************ **/      
    function tabsBtn(btn) {
        let allReminderCards   = document.querySelectorAll(".reminder_card"); //==== All Reminders
        let allCompletedCards  = result.querySelectorAll(".completed"); //==== Completed Reminders
        let showAllTasksBtn    = document.querySelector('.all');
        btn.classList.contains("all") //===== Show All Boxes
        ? (allReminderCards.forEach((card) => (card.style.display = "block")), allCompletedCards.forEach((compCard) => (compCard.style.display = "block")),(set_btn.style.cssText = `opacity: 1; pointer-events: all`), (countNum.textContent = `All: ${result.childElementCount}`))
        : btn.classList.contains("completed_btn") //===== Show Completed Boxes
        ? (allReminderCards.forEach((card) => (card.style.display = "none")), allCompletedCards.forEach((compCard) => (compCard.style.display = "block")), (reminder_fill.classList.remove('opened')), (set_btn.style.cssText = `opacity: 0; pointer-events: none`), (countNum.textContent = `completed: ${allCompletedCards.length}`))
        : ((result.innerHTML = ""), showAllTasksBtn.click(), localStorage.removeItem("items"), saveCreated());
    };
  /** ********** End Function Handler Show All Reminders & Completed ************ **/ 

  /** ********** Start Function Handler All Bottom Buttons Active Status ************** **/
    (function tabsHandler() {
        tabs.forEach((btn) => {
          //===== This Statement Set All Button As Default
          if (btn.classList.contains('all')) btn.classList.add('active');
          //====== Set The Count Message
          countNum.textContent = `All: ${result.childElementCount}`;
          //===== Click Buttons Statements
          btn.addEventListener('click', (event) => {
            //===== Remove Active Class
            btn.parentElement.querySelectorAll('.active').forEach(element => {
              element.classList.remove('active');
            });
            //===== Add Active
            event.target.classList.add('active');
            //===== Run The Function Handler Show All Reminders & Completed 
            tabsBtn(btn);
          });
        });
    }());
  /** ********** End Function Handler All Bottom Buttons Active Status **************** **/

/** ************** Start Notification ****************** **/
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
          icon: "images/favicon.svg",
          body: `${nSubject}`
        });
        
        notifyMessage.onclick = () => {
          window.open("index.html");
        };
        // Hide Notify After some Milli Seconds
        setTimeout(notifyMessage.close.bind(notifyMessage), 7000);
      };
    };
/** ************** End Notification ***************** **/

/** ******* Start Function Store The Every Reminders Milliseconds ******* **/
    function storeMS(element) {
        //==== Get The Real MilliSecond From Input Time And Decrease 2 Hours + Selected Date Milli Seconds
          let selectedDate = (time.valueAsNumber - 7200000) + date.valueAsNumber,
        //==== Set NeW Date
          theDate = new Date(),        
        //==== Set Value Of The New Date
          currentDate = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate(), theDate.getHours(), theDate.getMinutes(), 0),
        //=== The Diffrent Time Between Current And Selected Date & Decrease Current Seconds
          diferent  = (selectedDate - currentDate),
          lastValMS = diferent - (theDate.getSeconds() * 1000),
        //===== Span Contain Diffrent Time Between Current & Selected Time
          theSpan    = document.createElement("span"),
          spanText   = document.createTextNode(lastValMS),
          currentTxt = document.createTextNode(currentDate),
          theCurrent = document.createElement("span");
          //===== Append Text Span To span
          theSpan.appendChild(spanText);
          theCurrent.appendChild(currentTxt);
          element.appendChild(theSpan);
          element.appendChild(theCurrent);
        //===== Set ClassName
          theSpan.className = "dif_time";    
          theCurrent.className = "current_t";
    };
/** ******* End Function Store The Every Reminders Milliseconds ********** **/

/** ******* Start Function Handler The Notifition To Every Reminder ******* **/
    function handlerAllStoredNotification() {
      if(result.innerHTML !== '') {
        //====== All Spans Contains Millisecond Of Cards
        let theSpans    = document.querySelectorAll(".dif_time");
        let theCurrent  = document.querySelectorAll(".current_t");
        let theSound    = new Audio("Sound/alarm.mp3"); //==== Set The Sound Source
        //===== Looping All Span Contain Diffrent Time Between Current & Selected Time
        theSpans.forEach( (element, index) => {
          let spanMs = parseInt(element.textContent);
          timeout = setTimeout(() => {    
             // ======= Set Title & Subject On Notification Body From Exist Reminder
              let notiTitle   = document.querySelectorAll(".card_title")[index].textContent;
              let notiSubject = document.querySelectorAll(".card_subject")[index].textContent;
              let theCard = document.querySelectorAll('.reminder_card')[index];
              //===== Set arguments On Notification
              notifyMe(notiTitle, notiSubject);
              //===== Add Completed Class Name On Finished Task Card                
              theCard.classList.add('completed');
              //==== Remove Exist Span Contain Diffrent Time & Current Time
              element.remove();
              theCurrent[index].remove();
              //==== Play The Sound
              theSound.play();
              //===== Run Saved Reminders Function .  
              localStorage.setItem('items', result.innerHTML);              
            }, spanMs);
        });
      };
    };
    handlerAllStoredNotification();
/** ******* End Function Handler The Notifition To Every Reminder ******* **/
    
    /** ************** If The User Close Tap  ************** **/
    window.addEventListener('beforeunload',  (e) => {
      return sessionStorage.setItem('tapClosed', 'No');
    });

/** ********* Start Function Handler If The Page Load Or Close & Open Again ********** **/
    window.onload = () => {   
      if(result.innerHTML !== '') {
        if(sessionStorage.getItem('tapClosed') === null) {
          clearTimeout(timeout);
          Array.from(result.querySelectorAll('.dif_time')).forEach((el, index) => {
            let pastDate = result.querySelectorAll('.current_t')[index].textContent;
            let theDate  = new Date();  //==== Set NeW Date
            //==== Set Value Of The New Date
            let currentDate = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate(), theDate.getHours(), theDate.getMinutes(), 0);
            //===== Set Value Of Past date
            let pastDateVal     = new Date(pastDate);
            let theDifferent    = parseInt(el.textContent);
            let thecurrSeconds  = (theDate.getSeconds() * 1000);
            let theNewCurrent   = (currentDate - pastDateVal);
            let theNewDifferent = (theDifferent - theNewCurrent);
            el.innerHTML        = theNewDifferent - thecurrSeconds;
            //====== Run Function Handler The Notifition To Every Reminder 
            handlerAllStoredNotification();
          });
        };
      };
    };
/** ********* End Function Handler If The Page Load Or Close & Open Again ********** **/
    
/** ****************************
    End The Reminder App
********************************** **/
