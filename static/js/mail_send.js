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
            Email.send({
                    Host: "smtp.gmail.com",
                    Username: "kay.mailserver@gmail.com",
                    Password: "occignczmssovelf",
                    To: 'thanhkien76qn@gmail.com',
                    From: email,
                    Subject: 'nguyenthanhkienit.github.io',
                    Body: message,
                })
                .then(function(message) {
                    alert("Message has been sent successfully.")
                });
        }
    }
}