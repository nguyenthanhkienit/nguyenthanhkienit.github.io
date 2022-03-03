const captcha = document.querySelector(".captcha"),
    reloadBtn = document.querySelector(".reload-btns"),
    inputField = document.querySelector(".input-area input"),
    checkBtn = document.querySelector(".send .check-btn"),
    statusTxt = document.querySelector(".status-text");

//storing all captcha characters in array
let allCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
    't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
];

function getCaptcha() {
    for (let i = 0; i < 6; i++) { //getting 6 random characters from the array
        let randomCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];
        captcha.innerText += ` ${randomCharacter}`; //passing 6 random characters inside captcha innerText
    }
}
getCaptcha(); //calling getCaptcha when the page open
statusTxt.style.display = "block";
statusTxt.innerText = "Please enter captcha!";

//calling getCaptcha & removeContent on the reload btn click
reloadBtn.addEventListener("click", () => {
    removeContent();
    getCaptcha();
});

function removeContent() {
    inputField.value = "";
    captcha.innerText = "";
    //statusTxt.style.display = "block";
}

function send_mail() {
    var name = jQuery("#name").val();
    var email = jQuery("#email").val();
    var subject = jQuery("#subject").val();
    var message = jQuery("#message").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var flag = 0;
    if (name == "") {
        jQuery("#name").addClass('invalid');
        jQuery("#val_user_name").html("Your Name is Required");
        flag = 1;
    } else {
        jQuery("#name").removeClass('invalid');
        jQuery("#val_user_name").html("");
    }

    if (email == "") {
        jQuery("#email").addClass('invalid');
        jQuery("#val_user_email").html("Please Enter Email");
        flag = 1;
    } else if (!email.match(mailformat)) {
        jQuery("#email").addClass('invalid');
        jQuery("#val_user_email").html("Please Enter Valid Email");
        flag = 2;
    } else {
        jQuery("#email").removeClass('invalid');
        jQuery("#val_user_email").html("");
    }

    // if (subject == "") {
    //     jQuery("#subject").addClass('invalid');
    //     jQuery("#val_subject").html("Subject is Required");
    //     flag = 1;
    // } else {
    //     jQuery("#subject").removeClass('invalid');
    //     jQuery("#val_subject").html("");
    // }

    if (message == "") {
        jQuery("#message").addClass('invalid');
        jQuery("#val_message").html("Please Describe your thoughts");
        flag = 1;
    } else {
        jQuery("#message").removeClass('invalid');
        jQuery("#val_message").html("");
    }

    if (flag == 1) {
        setTimeout(() => { alert("Please enter full information.") }, 500)
    } else {
        if (flag == 2) {
            setTimeout(() => { alert("Please enter correct email format.") }, 500)
        } else {

            // checkBtn.addEventListener("click", e => { //tạm bỏ
            //preventing button from it's default behaviour
            statusTxt.style.display = "block";
            //adding space after each character of user entered values because I've added spaces while generating captcha
            let inputVal = inputField.value.split('').join(' ');
            if (inputVal == captcha.innerText) { //if captcha matched

                Email.send({
                    Host: "smtp.gmail.com",
                    Username: "kay.mailserver@gmail.com",
                    Password: "occignczmssovelf",
                    To: 'thanhkien76qn@gmail.com',
                    From: email,
                    Subject: 'nguyenthanhkienit.github.io',
                    Body: message,
                })

                // .then(function(message) {
                //     alert("Message has been sent successfully.")
                // }); //tạm bỏ
                setTimeout(() => { //calling removeContent & getCaptcha after 4 seconds
                    removeContent();
                    getCaptcha();
                    statusTxt.style.color = "#E0A80D";
                    statusTxt.innerText = "Message has been sent successfully.";
                }, 3000);
            } else {
                statusTxt.style.color = "#ff0000";
                statusTxt.innerText = "Captcha not matched. Please try again!";
            }
            // }); //tạm bỏ

        }
    }
}

function send_mail_input() {
    var name = jQuery("#name").val();
    var email = jQuery("#email").val();
    var subject = jQuery("#subject").val();
    var message = jQuery("#message").val();
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var flag = 0;
    // if (name == "") {
    //     jQuery("#name").addClass('invalid');
    //     jQuery("#val_user_name").html("Your Name is Required");
    //     flag = 1;
    // } else {
    //     jQuery("#name").removeClass('invalid');
    //     jQuery("#val_user_name").html("");
    // }

    // if (email == "") {
    //     jQuery("#email").addClass('invalid');
    //     jQuery("#val_user_email").html("Please Enter Email");
    //     flag = 1;
    // } else if (!email.match(mailformat)) {
    //     jQuery("#email").addClass('invalid');
    //     jQuery("#val_user_email").html("Please Enter Valid Email");
    //     flag = 2;
    // } else {
    //     jQuery("#email").removeClass('invalid');
    //     jQuery("#val_user_email").html("");
    // }

    // // if (subject == "") {
    // //     jQuery("#subject").addClass('invalid');
    // //     jQuery("#val_subject").html("Subject is Required");
    // //     flag = 1;
    // // } else {
    // //     jQuery("#subject").removeClass('invalid');
    // //     jQuery("#val_subject").html("");
    // // }
    // if (message == "") {
    //     jQuery("#message").addClass('invalid');
    //     jQuery("#val_message").html("Please Describe your thoughts");
    //     flag = 1;
    // } else {
    //     jQuery("#message").removeClass('invalid');
    //     jQuery("#val_message").html("");
    // }

    // if (flag == 1) {
    //     setTimeout(() => { alert("Please enter full information.") }, 500)
    // } else {
    //     if (flag == 2) {
    //         setTimeout(() => { alert("Please enter correct email format.") }, 500)
    //     } else {
    Email.send({
            Host: "smtp.gmail.com",
            Username: "kay.mailserver@gmail.com",
            Password: "",
            To: 'thanhkien76qn@gmail.com',
            From: email,
            Subject: 'nguyenthanhkienit.github.io NOT CAPCHA',
            Body: message,
        })
        // .then(function(message) {
        //     alert("Message has been sent successfully.")
        // });
        //     }
        // }
}