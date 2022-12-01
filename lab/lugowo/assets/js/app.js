$(function () {
  $(".loading").hide();

  $(".play").click(function () {
    // openFullscreen();
    $(this).addClass("hide");
    $(".quotes").addClass("hide");
    $(".quotes-author").addClass("hide");

    setTimeout(() => {
      visualizer();
    }, 1000);

    setTimeout(() => {
      $(".rabbit-lyrics").removeClass("hide");
      $(".rabbit-lyrics").addClass("unhide");
    }, 2000);
  });

  function openFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      /* Firefox */
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      /* IE/Edge */
      document.documentElement.msRequestFullscreen();
    }
  }
});
