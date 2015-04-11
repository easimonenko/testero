$("#users-list #users-menu").click(function () {
  $("#content")
    .hide("slow", function () {
      $(this)
        .html(app.modules.users.html["menu"])
        .slideDown("slow");
    });

  return false;
});

$.ajax({
  type: "POST",
  url: "/users/findAllUsers",
  success: function (data)
  {
    if (!data.status) {
      var alertType = data.level;
      if (!alertType){
        alertType = "error";
      }
      $("#content #alert")
        .addClass("alert-" + alertType)
        .removeAttr("hidden")
        .html(msg);
    }
    else if (data.users.length === 0) {
      var alertType = data.level;
      if (!alertType){
        alertType = "warning";
      }
      $("#content #alert")
        .addClass("alert-" + alertType)
        .removeAttr("hidden")
        .html(msg);
    }
    else {
      $("#content #list table tbody")
        .html("<tr><td>1</td><td>" + data.users[0].email + "</td></tr>");
      for (var i = 1; i < data.users.length; i++) {
        $("#content #list table tr")
          .last()
          .after("<tr><td>" + (i + 1) + "</td><td>" + data.users[i].title + "</td></tr>");
      }
      $("#content #list").removeAttr("hidden");
    }
    $("#content").slideDown("slow");
  }
});