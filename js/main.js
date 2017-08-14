/*global $, console*/

$(document).ready(function () {
    "use strict";
    var name, email, subject, message, dataTable, errors, collect, i, rsp, regEx, ev;
    dataTable = {};
    errors = [];
    $(".container").load("./partials/home.html");
    
    function handleResponse(rsp) {
        $(".feedback").html(rsp);
        //clear the form
        $("#name").val("");
        $("#email").val("");
        $("#subject").val("");
        $("#message").val("");
    }
    function handleErrors(jqXHR, textStatus, errorThrown) {
        console.log("textStatus =" + textStatus + "\n" + "errorThrown =" + errorThrown);
    }
    function validateForm(ev) {
        ev.preventDefault();
        regEx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        name = $("#fullname").val();
        email = $("#email").val();
        subject = $("#subject").val();
        message = $("#message").val();
        
        if (name === "") {
            errors.push("<li>Enter your name.</li>");
        } else {
            dataTable.name = name;
        }
        
        if (email === "") {
            errors.push("<li>Enter your email address.</li>");
        } else {
            if (regEx.test(email)) {
                dataTable.email = email;
            } else {
                errors.push("<li>Invalid email entered.</li>");
            }
        }
        
        if (subject === "") {
            errors.push("<li>Choose a subject line.</li>");
        } else {
            dataTable.subject = subject;
        }
        
        if (message === "") {
            errors.push("<li>Write a message.</li>");
        } else {
            dataTable.message = message;
        }
        
        if (errors.length === 0) {
            $.ajax({
                type: "POST",
                url: "./web-service/service.php",
                data: dataTable,
                dataType: "html"
            }).done(handleResponse).fail(handleErrors);
        } else {
            collect = "<h4>Please fix the following errors:</h4><ul>";
            $.each(errors, function (i, v) {
                collect += v;
                $(".error").html(collect);
            });
            collect += "</ul>";
            errors = [];
            collect = {};
        }
    }
    
    $("nav a").on("click", function (ev) {
        ev.preventDefault();
        if ($(this).text() === "Home") {
            $(".container").load("./partials/home.html");
        } else {
            $(".container").load("./partials/contact.html", function () {
                $("form").on("submit", validateForm);
            });
        }

    });
});