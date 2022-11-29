$(function () {
  $(".loading").hide();

  $(".play").click(function () {
    $(this).addClass("hide");
    $(".quotes").addClass("hide");
    $(".quotes-author").addClass("hide");

    setTimeout(() => {
      $("#audio-1")[0].play();
    }, 1000);

    setTimeout(() => {
      $(".rabbit-lyrics").removeClass("hide");
    }, 2000);
  });
});
