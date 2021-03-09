var isMusic1Playing = false;
var isMusic2Playing = false;
var $audio1 = $("#audioPlayer1");
var $audio2 = $("#audioPlayer2");
var slider = document.getElementById("myRange");

var lastAudio = 0;

var totalItems = $(".item").length;
var currentIndex = $("div.active").index() + 1;

function fnTemplate3_v1(_div) {
  var slide = $(_div);
  var listDataId;
  var listAnsDataId;
  var questionLength = $(".question").length;

  $audio1[0].pause();
  $audio1[0].currentTime = 0;
  // $("#slider").slider({"value": 0});
  slider.value = 0;
  $audio1[0].pause();
  $audio1[0].removeEventListener("timeupdate", fnUpdateTimer);
  // isMusic1Playing = true;
  $("#pButton .playImg").show();
  $("#pButton .pauseImg").hide();

  setAudio($(slide).attr("data-audioSrc"));
  var currNum = 1;
  $(".queBox .clickableBox,.queBox .textBox").on("click", function () {
    currNum = $(this).parent().attr("id").split("_")[1];
    $audio1[0].pause();
    $audio2[0].pause();
    $("#pButton .playImg").show();
    $("#pButton .pauseImg").hide();
    $(".pagePopup .carousel-inner .item").removeClass("active");
    $(".pagePopup .carousel-inner .item_" + currNum + "").addClass("active");
    $(".popup_" + currentIndex).show();
  });
  $(".pagePopup .closeBtn").on("click", function () {
    $audio2[0].pause();
    $(".pagePopup").hide();
  });
  $(".popupSlider").on("slid.bs.carousel", function (e) {
    $audio2[0].pause();
  });

  $(".list1 .listContainer").on("click", function () {
    if ($(this).hasClass("disabled")) {
      return false;
    }
    listDataId = $(this).attr("data-id");
    $(".circle").removeClass("selected");
    $(this).find(".circle").addClass("selected");
  });

  $(".list2 .listContainer").on("click", function () {
    if (
      $(this).hasClass("disabled") ||
      !$(".list1 .listContainer").find(".circle").hasClass("selected")
    ) {
      return false;
    }
    listAnsDataId = $(this).attr("data-answer-id");
    $(this).find(".circle").addClass("selected");

    if (listDataId == listAnsDataId) {
      $(".line" + listDataId).show();
      fnAudio($(".showAnswerTickMark"));
      $(this).addClass("disabled");
      setTimeout(function () {
        $(".list1 .que_" + listDataId + "").addClass("disabled");
        $(".circle").removeClass("selected");
      }, 50);
    } else {
      $(this).find(".showAnswerCrossMark").show();
      fnAudio($(".showAnswerCrossMark"));
      setTimeout(function () {
        $(".list2 .circle").removeClass("selected");
        $(".showAnswerCrossMark").hide();
      }, 500);
    }

    var showAnsDis = false;

    $("div.active")
      .find(".list2 .listContainer")
      .each(function () {
        if (!$(this).hasClass("disabled")) {
          showAnsDis = true;
        }
      });
    if (!showAnsDis) {
      $(".showAnsBtn").addClass("disabled");
      $("div.active").find(".option").off("click");
      $("div.active").find(".question").addClass("disabled");
    } else {
      $(".showAnsBtn").removeClass("disabled");
    }
  });
  var showAnsDis = false;

  $("div.active").find(".list2 .listContainer").each(function () {
      if (!$(this).hasClass("disabled")) {
        showAnsDis = true;
      }
    });
  if (!showAnsDis) {
    $(".showAnsBtn").addClass("disabled");
    $("div.active").find(".option").off("click");
  } else {
    $(".showAnsBtn").removeClass("disabled");
  }
}

function fnReloadAll() {
  $(".list1 .listContainer, .list2 .listContainer").removeClass("disabled");
  $(".list1 .que_1, .list2 .opt_3").addClass("disabled");
  $(".line").hide();    
  $(".line1").show();
  $(".circle").removeClass("selected");
  $(".showAnsBtn").removeClass("disabled");
  $("#myCarousel").carousel(0);
  stopAudio();
  fnTemplate3_v1($("div.active"));
}

function fnReloadScreen() {
  $("div.active")
    .find(".list1 .listContainer, .list2 .listContainer")
    .removeClass("disabled");
  $("div.active").find(".line").hide();
  $("div.active").find(".circle").removeClass("selected");
  $(".showAnsBtn").removeClass("disabled");

  stopAudio();
  fnTemplate3_v1($("div.active"));
}

function fnAudio(obj) {
  var titleAudioPath = $(obj).attr("data-audioSrc");
  $audio2[0].setAttribute("src", titleAudioPath);
  $audio2[0].load();
  var playPromise = $audio2[0].play();

  if (playPromise !== undefined) {
    playPromise
      .then(function (value) {
        // Automatic playback started!
        // Show playing UI.
        $audio1[0].currentTime = 0;
        $("#slider").slider({ value: 0 });
        $audio1[0].pause();
        $audio1[0].removeEventListener("timeupdate", fnUpdateTimer);
        $("#pButton .playImg").show();
        $("#pButton .pauseImg").hide();
      })
      .catch(function (error) {
        // Auto-play was prevented
        // Show paused UI.
      });
  }
}

function showAns() {
  // music.pause();
  // pButton.className = "";
  // pButton.className = "play";
  if ($(".showAnsBtn").hasClass("disabled")) {
    return false;
  }

  $audio1[0].pause();
  $audio2[0].pause();

  $("div.active")
    .find(".list1 .listContainer, .list2 .listContainer")
    .addClass("disabled");
  $("div.active").find(".line").show();
  $("div.active").find(".circle").removeClass("selected");
  $(this).addClass("disabled");
}

function setAudio(_src) {
  if (_src == "") {
    $(".controlsDiv").addClass("hide");
  } else {
    $(".controlsDiv").removeClass("hide");
  }
  $audio1[0].setAttribute("src", _src);
  $audio1[0].load();
}

/* Title Audio function */
function fnTitleAudioClick(obj) {
  if ($(obj).hasClass("hide")) {
    return false;
  }
  //$audio1[0].currentTime = 0;
  //$("#slider").slider({"value": 0});
  $audio1[0].pause();
  $audio1[0].removeEventListener("timeupdate", fnUpdateTimer);
  $("#pButton .playImg").show();
  $("#pButton .pauseImg").hide();
  var titleAudioPath = $(obj).attr("data-audioSrc");
  console.log("fnTitleAudioClick 	" + titleAudioPath);
  $audio2[0].setAttribute("src", titleAudioPath);
  $audio2[0].load();
  $audio2[0].play();
  isMusic1Playing = false;
  isMusic2Playing = true;
}

function fnUpdateTimer() {
  var progressValue = Math.round(
    ($audio1[0].currentTime / $audio1[0].duration) * 100
  );

  slider.value = progressValue;
}

function fnStartAudio(_state) {
  $audio2[0].pause();
  if (_state == "play") {
    $("#pButton .playImg").hide();
    $("#pButton .pauseImg").show();
    $audio1[0].play();
    isMusic1Playing = true;
  } else {
    $("#pButton .playImg").show();
    $("#pButton .pauseImg").hide();
    $audio1[0].pause();
    lastAudio = 0;
    isMusic1Playing = false;
  }
  $audio1[0].addEventListener("timeupdate", fnUpdateTimer);
}

function stopAudio() {
  $audio1[0].pause();
  $("#pButton .playImg").show();
  $("#pButton .pauseImg").hide();
  $audio1[0].currentTime = 0;
  slider.value = 0;
  isMusic1Playing = false;
  $audio2[0].pause();
  isMusic2Playing = false;
  lastAudio = 0;
}

function fnSetPlayer() {
  if (currentIndex == 1) {
    $(".backBtn").addClass("disabled");
  }

  if (totalItems == 1) {
    $(
      ".navigationControls, .nextBtn, .reloadBtnScreen, .backBtn, .pageNumber"
    ).addClass("hide");
  }

  if ($(".title").attr("data-audioSrc") == "") {
    $(".title").addClass("hide");
    $(".headingTitle").removeClass("col-xs-10").addClass("col-xs-11");
  }

  $audio1[0].addEventListener("playing", function () {
    lastAudio = 1;
    isMusic1Playing = true;
  });

  $audio2[0].addEventListener("playing", function () {
    lastAudio = 2;
    isMusic2Playing = true;
  });

  $audio1[0].addEventListener("pause", function () {
    isMusic1Playing = false;
  });

  $audio2[0].addEventListener("pause", function () {
    isMusic2Playing = false;
  });

  $audio1[0].addEventListener("ended", function () {
    lastAudio = 0;
    isMusic1Playing = false;
    $audio1[0].currentTime = 0;
    $("#slider").slider({ value: 0 });
    $audio1[0].pause();
    $audio1[0].removeEventListener("timeupdate", fnUpdateTimer);
    $("#pButton .playImg").show();
    $("#pButton .pauseImg").hide();
  });

  $audio2[0].addEventListener("ended", function () {
    lastAudio = 0;
  });

  slider.addEventListener(
    "input",
    function () {
      // console.log(">> input "+slider.value);
      // $audio1[0].pause();
      $audio1[0].removeEventListener("timeupdate", fnUpdateTimer);
      var setTime = Math.round((slider.value * $audio1[0].duration) / 100);
      $audio1[0].currentTime = setTime;
    },
    false
  );

  slider.addEventListener(
    "change",
    function () {
      // console.log("change >> "+isMusic1Playing);
      if (isMusic1Playing) {
        $audio1[0].play();
        $audio1[0].addEventListener("timeupdate", fnUpdateTimer);
      }
    },
    false
  );

  $("#myCarousel").on("slid.bs.carousel", function () {
    currentIndex = $("div.active").index() + 1;
    $(".pageNumber").html(currentIndex + " of " + totalItems);
    if (currentIndex == 1) {
      $(".backBtn").addClass("disabled");
    } else {
      $(".backBtn").removeClass("disabled");
    }

    if (currentIndex == totalItems) {
      $(".nextBtn").addClass("disabled");
    } else {
      $(".nextBtn").removeClass("disabled");
    }
    // need to edit template function name here:
    fnTemplate3_v1($("div.active"));
  });
  $(".pageNumber").html(currentIndex + " of " + totalItems);
}
