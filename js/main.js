// window.onbeforeunload = function() { return "Your progress will be lost."; };

// Zepto(function($)

window.sessionId;
window.tutorial = true;
window.tutorialStep = 0;
window.finished = false;
window.magicNumber = 4;
window.shownMatch = false;
window.partyIcons = {
  'act':'a',
  'green':'g',
  'internetparty':'i',
  'labour':'l',
  'maori':'m',
  'national':'n',
  'nzfirst':'1',
  'top':'t',
  'unitedfuture': 'u',
  'mana': 'r',
  'conservative': 'v',
  'democrats': 's'
}

function isDesktop() {
  return $('.no-touch').length > 0;
}

$(document).ready(function() {
  window.sessionId = uuid();


  if (isDesktop() || !window.Zepto) {
    $('.swipe_text').text('Tap');
    $('.swiping_text').text('tapping');
    $('.icon.swipe').attr('data-icon', 'b');
    $('.tutorial_swipe_info').html('<div class="swipe_graphic_blue">Tap agree or disagree</div>');
  } else {
    initSwipe();
    $('.yes_button .down, .no_button .down').remove();
  }

  // $('.homepage').height($(document).height());

  setupQuiz();

  $('.homepage .skip').click(function(e) {
    startQuiz();
  });

  $('.homepage').click(function(){
    startTutorial();
  });

  $('.enter_the_draw').click(function() {
    joinMailingList();
  });

  $('.share_my_match a').click(function(e) {
    e.preventDefault();
    share_click($(e.target).attr('href'));
  });

  $('.join_the_mailling_list').click(function(e) {
    e.preventDefault();
    window.lastScreen = "final";
    animDivs('.back_button', '.left .menu');
    animDivs(".final", ".mailing_list");
  });

  $('.show_me_my_match').click(function(e) {
    e.preventDefault();
    animDivs(".final", ".results");
  });

  $('.menu').click(function() {
    $('.dropdown_menu li').show();
    if ($('.dropdown_menu').is(':visible')) {
      $('.dropdown_menu').hide();
    } else {
      $('.dropdown_menu').fadeIn(200);
    }
  });

  $('.back_button, .top_bar .candidate_logo').click(function() {
    if ($('.back_button').is(':visible')) {
      if (window.finished) {
        animDivs("." + currentScreen(), "."+window.lastScreen);
      } else {
        animDivs("." + currentScreen(), ".quiz_content");
      }
      animDivs('.back_button', '.left .menu');
      $('.top_bar .candidate_logo').css('cursor', 'default');
      if (window.shownMatch) {
        $('.top_bar .right').children().hide();
        $('.top_bar .right .heart_full').show();
      }
    }
  });

  $('.heart_full').click(function() {
    if (!window.finished) {
      $('.top_bar .right .icon').hide();
      $('.top_bar .right .icon.heart_broken').show();
    }
    setLastScreen();
    showBackButton();

    endQuiz();
  });

  $('.heart_broken').click(function() {
    showDetails();
  });

  $('.dropdown_menu .join_mailing_list').click(function() {
    $('.dropdown_menu').hide();
    setLastScreen();
    animDivs("."+window.lastScreen, ".mailing_list");
    showBackButton();
  });

  $('.dropdown_menu .about').click(function() {
    $('.dropdown_menu').hide();
    setLastScreen();
    animDivs("."+window.lastScreen, ".about");
    showBackButton();
  });

  $('.dropdown_menu .more_quizzes').click(function() {
    $('.dropdown_menu').hide();
    setLastScreen();
    animDivs("."+window.lastScreen, ".more_quizzes");
    showBackButton();
  });

  $('.dropdown_menu .vvc_link').click(function() {
    $('.dropdown_menu').hide();
  });

  $('.check_box').click(function() {
    if ($('.check_box img').length > 0) {
      $('.check_box img').remove();
    } else {
      $('.check_box').html('<img src="img/tick.png" />');
    }
  });

  // $('.content').animate({'top': 61}, 100);
})

function showBackButton() {
  if ($('.left .menu').is(':visible')) {
    animDivs('.left .menu', '.back_button');
  } else {
    $('.back_button').show();
  }
  $('.top_bar .candidate_logo').css('cursor', 'pointer');

}

function resetButton() {
  $('.yes_button img').css({'height': "100%", 'width': "100%"});
  $('.yes_button .down, .no_button .down').hide();
  $('.yes_button .up, .no_button .up').show();
}

function yesNoButtonStates() {
  $('.yes_button').mouseenter(function(e) {
    $('.yes_button .up').hide();
    $('.yes_button .down').show();
  });

  $('.yes_button, .no_button').bind('mouseleave mouseup touchend', function(e) {
    resetButton();
  });

  $('.no_button').mouseenter(function(e) {
    $('.no_button .up').hide();
    $('.no_button .down').show();
  });
}

function infoButtonStates() {
  $('.info_button').mouseenter(function(e) {
    if (!$('.info_button .disabled').is(':visible')) {
      if ($('.big_question').is(':visible')) {
        $('.info_button .inactive').hide();
        $('.info_button .active').show();
      } else {
        $('.info_button .active').hide();
        $('.info_button .inactive').show();
      }
    }
  });

  $('.info_button').bind('click tap touchend', function(e) {
    e.preventDefault();
    if (!$('.info_button .disabled').is(':visible')) {
      if ($('.big_question').is(':visible')) {
        animDivs('.info_button .inactive', '.info_button .active');
        animDivs('.big_question', '.policy');
      } else {
        animDivs('.info_button .active', '.info_button .inactive');
        animDivs('.policy', '.big_question');
      }
    }
  });
}


function currentScreen() {
  cs = $('.content').children(':visible').attr('class');
  return (cs == undefined) ? '' : cs;
}

function setLastScreen() {
  window.lastScreen = currentScreen();
}

function startTutorial() {
  window.tutorialStep = 1;
  $('.content').animate({'top': 61}, 100);
  // $('.content').css('position', 'absolute');
  // $('.top_bar .link.center').text('How to find your match');

  $('.tutorial .third .swipe_graphic_blue').click(function(e) {
    $('.tutorial').fadeOut(100, function() {
      startQuiz();
    });
  });

  $('.tutorial .second .swipe_graphic_white').click(function(e) {
    animDivs('.tutorial .second', '.tutorial .third');
  });

  $('.tutorial .info_button').click(function(e) {
    e.preventDefault();
    yesNoButtonStates();
    $('.tutorial .info_button').css('z-index', 20);
    animDivs('.tutorial .big_question', '.tutorial .policy');
    $('.tutorial .info_button .click_icon').remove();

    window.tutorialStep = 2;

    $('.tutorial .yes_button, .tutorial .no_button').bind('tap click', function(e){
      window.tutorialStep = 3;
      e.preventDefault();
      animDivs('.tutorial .first', '.tutorial .second');
    });
  });

  animDivs('.homepage', '.top_bar, .tutorial');
  $('.tutorial .info_button').children().show();
}

function startQuiz() {
  console.log('starting');
  window.tutorial = false;
  animDivs('.top_bar .how_to', '.top_bar .candidate_logo');
  $('.content').animate({'top': 61}, 100);
  $('.tutorial').remove();
  changeCategory();
  animDivs('.homepage', '.top_bar, .quiz_content');

  yesNoButtonStates();
  infoButtonStates();
  // if (window.Zepto) {
    // initSwipe();
  // }

  $('.yes_button').bind('click tap', function(e){
    e.preventDefault();
    // pulse('.yes_button');
    yes();
  });

  $('.no_button').bind('click tap', function(e){
    e.preventDefault();
    // pulse('.no_button');
    no();
  });
}

function resumeQuiz(currentScreen) {
  animDivs(currentScreen, '.top_bar, .quiz_content');
  //show heart
}

function calculateHeart() {
  if (uniqueMatchedPolicies(sortedParties()[0].votes).length >= window.magicNumber) {
    if (!window.shownMatch) {
      setLastScreen();
      showBackButton();
      endQuiz();
      window.shownMatch = true;
    } else {
      $('.top_bar_container .link.right').children().hide();
      $('.top_bar_container .link.right .heart_full').show();
      $('.heart_graphic').click(function() {
        endQuiz();
      });
    }
  } else {
    $('.top_bar_container .link.right').children().hide();
    $('.top_bar_container .link.right .heart_empty').show();
  }
}

function yes() {
  //console.log('Yes');
  vote();
  nextQuestion();
}

function no() {
  //console.log('No');
  nextQuestion();
}

function vote() {
  currentQuestionParties = currentQuestionData().parties;
  $.each(window.quizData.parties, function(index, party){
    if (currentQuestionParties.indexOf(party.slug) > -1) {
      party.votes.push({"c":currentCategoryData().id, "q":currentQuestionData().id});
    }
  });
}

function currentCategoryData() {
  return window.quizData.categories[window.quiz.currentCategory];
}

function currentQuestionData() {
  return currentCategoryData().questions[window.quiz.currentQuestion];
}

function setupQuiz() {
  window.quiz = {}
  window.quiz.currentCategory = 0;
  window.quiz.currentQuestion = 0;

  $.getJSON("quiz.json", function(data) {
    window.quizData = data;
     console.log(data);

    setupQuestions();
  });
}

function setupQuestions() {
  // //console.log(window.quizData);

  // Shuffle
  window.quizData.categories = shuffle(window.quizData.categories);
  $.each(window.quizData.categories, function(index, category){
    // //console.log(category.name);
    category.questions = shuffle(category.questions);
    // $.each(category.questions, function(index, question){
      // //console.log(question.question);
    // });
  });

  // set number of categories for each party
  $.each(window.quizData.parties, function(index, party) {
    party.categories = [];
    $.each(window.quizData.categories, function(index, category) {
      $.each(category.questions, function(index, question) {
        if (question.parties.indexOf(party.name.toLowerCase().replace(' ', '')) > -1) {
          if (party.categories.indexOf(category.name) == -1) {
            // //console.log(category.name);
            party.categories.push(category.name);
          }
        }
      });
    });
  });

  // Set vote counts to 0
  $.each(window.quizData.parties, function(index, party) {
    party.votes = [];
  });

  //Display first Q
  firstQ = window.quizData.categories[0].questions[0];
  setQuestionDisplay(firstQ);

  // startQuiz();
  // $('.content').animate({'top': 61}, 100);
  // window.quizData.parties[Math.floor(Math.random()*7)].votes = [{'c':1, 'q':1},{'c':2, 'q':1}];
  // window.quizData.parties[Math.floor(Math.random()*7)].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];
  // window.quizData.parties[Math.floor(Math.random()*7)].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];

  // window.quizData.parties[0].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];
  // window.quizData.parties[1].votes = [{'c':1, 'q':1},{'c':2, 'q':1}];
  // window.quizData.parties[2].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];
  // window.quizData.parties[3].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];
  // window.quizData.parties[4].votes = [{'c':1, 'q':1},{'c':2, 'q':1}];
  // window.quizData.parties[5].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];
  // window.quizData.parties[6].votes = [{'c':3, 'q':1},{'c':4, 'q':1}];

  // // window.quizData.parties[2].votes = [1,0];
  // endQuiz();
}

function categoriesLength() {
  return window.quizData.categories.length;
}

function categoryLength(categoryI) {
  return window.quizData.categories[categoryI].questions.length
}

function getNextQuestion() {
  //console.log("current Q:" + window.quiz.currentQuestion + ", C:" + window.quiz.currentCategory);

  $('.progress span').removeClass('active');

  cLength = categoryLength(window.quiz.currentCategory);
  //console.log(window.quiz.currentQuestion + "/" + cLength);
  if (window.quiz.currentQuestion < cLength-1) {
    $($('.progress span')[(window.quiz.currentQuestion+1)]).addClass('active');
    window.quiz.currentQuestion += 1;
  } else if (window.quiz.currentCategory < categoriesLength()-1) {
    window.quiz.currentQuestion = 0;
    window.quiz.currentCategory += 1;
    changeCategory();
  } else {
    return false;
  }
  return window.quizData.categories[window.quiz.currentCategory].questions[window.quiz.currentQuestion];
}

function nextQuestion() {
  animDivs('.question_content', '.question_content');
  $('.quiz_content .big_question').show();
  $('.quiz_content .policy').hide();

  nextQ = getNextQuestion();
  if (!nextQ) {
    // $('.top_bar .back_button').remove();
    window.finished = true;
    window.onbeforeunload = null;
    endQuiz();
    return;
  }

  setQuestionDisplay(nextQ);
}

function changeCategory() {
  category = window.quizData.categories[window.quiz.currentCategory];

  $('.quiz_content .category .name').fadeOut(100, function() {
    $('.quiz_content .category .name span').text(category.title);
    $('.quiz_content .category .name').show();
  });

  $('.quiz_content .progress span').remove();

  for(var i = 0; i < category.questions.length; i++) {
    $('.quiz_content .progress').append($("<span />"));
  }

  $('.quiz_content .progress span:first').addClass('active');

  calculateHeart();
}

function setQuestionDisplay(question) {
  $('.overlay').hide();
  $('.quiz_content .big_question').text(question.question);
  $('.quiz_content .policy').text(question.policy);

  $('.info_button').children().hide();

  if (question.policy == "") {
    $('.info_button').children().hide();
    $('.info_button .disabled').show();
  } else {
    $('.info_button .inactive').show();
  }

  resizeQuestion();
}

function resizeQuestion() {
  size = 20;
  do {
    $('.question_content').css('font-size', size + 'pt');
    // $('.question_content .policy').css('font-size', (size-10) + 'pt');
    size -= 1;
  } while (size > 8 && ($('.quiz_content .frame').height() > (.9*$('.quiz_content').height())));
}

function resizeTutorial() {
  size = 30;
  do {
    $('.tutorial .big_question, .tutorial .policy').css('font-size', size + 'pt')
    size -= 0.1;
  } while (size > 0.2 && ($('.tutorial .first .frame').height() > $('.tutorial').height()));
}

function scoreSortedParties() {
  return window.quizData.parties.sort(function(a, b){
    return ((uniqueMatchedPolicies(b.votes).length/b.categories.length) - (uniqueMatchedPolicies(a.votes).length/a.categories.length));
  });
}

function sortedParties() {
  return window.quizData.parties.sort(function(a, b){return uniqueMatchedPolicies(b.votes).length-uniqueMatchedPolicies(a.votes).length});
}

function endQuiz() {
  $('.about').hide();
  postAnonResults();
  // $('.top_bar_container .link.right').children().hide();
  // $('.top_bar_container .link.right .menu').show();

  //how many matches
  topVotes = sortedParties()[0].votes.length;
  if (topVotes > 0) { //Set threshold here
    topVoted = [];
    $.each(sortedParties(), function(index, party){
      if (party.votes.length == topVotes)
        topVoted.push(party);
    });
    //console.log(topVoted);

    showMatched(topVoted);
  }
}

function showMatched(topVoted) {
  if (topVoted.length > 3) {
    showDetails();
    return;
  }

  $('.top_bar .right .icon').hide();
  $('.top_bar .right .icon.heart_broken').show();

  $.each(topVoted, function(index, party){
    partyDiv = $('.match' + (index+1));
    partyDiv.find('.party_logo').attr('data-icon', window.partyIcons[party.slug]);
    partyDiv.find('.party_logo').addClass(party.slug)
    partyDiv.css({"background-color": party.colour});
  });


  $('.its_a_match .single, .its_a_match .double, .its_a_match .triple').hide();

  // show the correct frame
  switch(topVoted.length) {
    case 1:
      $('.match1 .matched_policies').html("<div><b>YOU MATCHED ON</b></div><div>"+matchedPolicies(topVoted[0].votes)+"</div>");
      $('.its_a_match .single').show();
      animDivs('.' + currentScreen(), '.its_a_match');
      return;
    case 2:
      $('.its_a_match .double').show();
      animDivs('.' + currentScreen(), '.its_a_match');
      resizeDoubleMatch();
      return;
    case 3:
      $('.its_a_match .triple').show();
      animDivs('.' + currentScreen(), '.its_a_match');
      resizeTripleMatch();
      return;
  }
}

function showDetails() {
  if (currentScreen().indexOf('results') > -1) {
    return;
  }

  // if (window.finished) {
    // $('.top_bar .right').children().remove();
  // }
  while ($(".party_result").length > 1) {
    $(".party_result:last").remove();
  }
  $.each(scoreSortedParties(), function(index, party){
    // console.log(party.name + " " + matchedPolicies(party.votes));
    new_party_result = $('.party_result:first').clone();

    new_party_result.css({"background-color": party.colour})

    new_party_result.find('.party_logo').attr('data-icon', window.partyIcons[party.slug]);
    new_party_result.find('.party_logo').addClass(party.slug);
    new_party_result.find('.score').text(Math.ceil((uniqueMatchedPolicies(party.votes).length/party.categories.length)*100)+"%");
    polices = (party.votes.length > 0) ? matchedPolicies(party.votes) : "No policies";
    new_party_result.find('.matched_policies').text(policies);
    new_party_result.show();
    $('.results').append(new_party_result);
  });

  $('.party_result:first').hide();
  animDivs('.' + currentScreen(), '.results');
}

function uniqueMatchedPolicies(votes) {
  matches = []
  $.each(votes, function(index, vote) {
    if (matches.indexOf(vote["c"]) == -1) {
      matches.push(vote["c"]);
    }
  });
  return matches;
}

function matchedPolicies(categories) {
  policies = "";
  categories = uniqueMatchedPolicies(categories);
  $.each(categories, function(index, category) {
    if (index > 0) {
      if (index == categories.length-1)
        policies += " and ";
      else
        policies += ", ";
    }
    // console.log(category);
    // console.log(getCategory(category));
    policies += getCategory(category).name;
  });
  return policies;
}

function getCategory(id) {
  for (var i = 0; i < window.quizData.categories.length; i++) {
    if (window.quizData.categories[i].id == id) {
      return window.quizData.categories[i];
    }
  }
}

function animDivs(oldDiv, newDiv) {
  // scrollToTop(100);

  $(oldDiv).fadeOut(100, function() {
    $(newDiv).show();
    if (currentScreen().indexOf('quiz_content') > -1) {
      resizeQuestion();
    } else if (currentScreen().indexOf('tutorial') > -1) {
      resizeTutorial();
    } else if (currentScreen().indexOf('its_a_match') > -1) {
      resizeDoubleMatch();
      resizeTripleMatch();
    }
  });
}

function resizeDoubleMatch() {
  doubleHeight = ($(window).height()-$('.top_bar').height())/2;
  $('.double .match1, .double .match2').height(doubleHeight);
  mid = doubleHeight/2;

  $('.double .match1 .party_logo').css('top', (30 + mid - ($('.double .match1 .party_logo').height()/2)));
  $('.double .match1 .party_logo').css('margin-left', - ($('.double .match1 .party_logo').width()/2));
  $('.double .match2 .party_logo').css('top', (-15 + mid - ($('.double .match2 .party_logo').height()/2)));
  $('.double .match2 .party_logo').css('margin-left', - ($('.double .match2 .party_logo').width()/2));
}

function resizeTripleMatch() {
  tripleHeight = ($(window).height()-$('.top_bar').height())/3;
  $('.double .match1, .double .match2, .triple match2').height(tripleHeight+2);
  mid = tripleHeight/2;

  $('.triple .match1 .party_logo').css('top', (50 + mid - ($('.triple .match1 .party_logo').height()/2)));
  $('.triple .match1 .party_logo').css('margin-left', - ($('.triple .match1 .party_logo').width()/2));

  $('.triple .match2 .party_logo').css('top', (20+mid - ($('.triple .match2 .party_logo').height()/2)));
  $('.triple .match2 .party_logo').css('margin-left', - ($('.triple .match2 .party_logo').width()/2));

  $('.triple .match3 .party_logo').css('top', (-20 + mid - ($('.triple .match3 .party_logo').height()/2)));
  $('.triple .match3 .party_logo').css('margin-left', - ($('.triple .match3 .party_logo').width()/2));

  $('.triple .frame').css({'position':'relative', 'top':tripleHeight-($('.triple .frame').height()+20)});
}

function joinMailingList() {
  if ($('.check_box img').length == 0) {
    $('.mailing_list .error').html("You must accept the terms and conditions");
    return;
  }

  // Validation
  $.get('mailchimp/store-address.php?ajax=1&' + $('.mailing_list form').serialize(), function(response){
    //console.log(response);

    if (response == "Success") {
      animDivs('.mailing_list', '.final');
    } else {
      $('.mailing_list .error').html(response);
    }
  });
}

function share_click(url) {
  width = window.screen.width * 0.7;
  height = window.screen.height * 0.4;

  width = width > 600 ? 600 : width;
  height = height > 300 ? 300 : height;

  var leftPosition, topPosition;
  //Allow for borders.
  leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
  //Allow for title and status bars.
  topPosition = (window.screen.height / 2) - ((height / 2) + 50);
  var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
  u=location.href;
  t=document.title;
  // 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(u)+'&t='+encodeURIComponent(t)
  window.open(url, 'sharer', windowFeatures);
  return false;
}

function pulse(el) {
  $(el+' img').animate({'height':'80%', 'width':'80%'}, 20, function() {
    $(el+' img').animate({'height':'100%', 'width':'100%'}, 20)
  });
}

function scrollToTop(duration) {
  if (duration < 0) {
      return;
  }
  var difference = -$(window).scrollTop();
  var perTick = difference / duration * 10;
  this.scrollToTimerCache = setTimeout(function() {
      if (!isNaN(parseInt(perTick, 10))) {
          window.scrollTo(0, $(window).scrollTop() + perTick);
          scrollToTop(duration - 10);
      }
  }.bind(this), 10);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function initSwipe() {
  var pointDown = {};
  var mouseDown = false;
  var swipeDist = 100;
  var vote = '';

  // initTime = new Date();
  // var lastUpdate = initTime.getTime();
  // var updateWait = 100; //ms

  $('body').bind('touchstart', function(e) {
    mouseDown = true;
    pointDown = {'x': e.touches[0].pageX, 'y': e.touches[0].pageY};
  });

  $('body').bind('touchmove', function(e) {
    // d = new Date();
    // limit the number of updates per second
    // if ((d-updateWait)<lastUpdate) {
    //   return;
    // } else {
    //   lastUpdate = d;
    // }


    var minDist = 10;
    var maxScale = 20;
    if (mouseDown) {
      changeX = e.touches[0].pageX-pointDown.x;
      changeY = e.touches[0].pageY-pointDown.y;
      if (Math.abs(changeY) < 50 && Math.abs(changeX) > minDist) {
        if (Math.abs(changeX) > Math.abs(changeY)) {
          //console.log({'x': changeX, 'y': changeY});

          scale = maxScale * (Math.abs(changeX)/swipeDist);
          scale = scale > maxScale ? maxScale : scale;

          if (window.tutorial) {
            switch (window.tutorialStep) {
              case 0:
                startTutorial();
                break;
              case 1:
                break;
              case 2:
                window.tutorialStep = 3;
                mouseDown = false;
                animDivs('.tutorial .first', '.tutorial .second');
                break;
              case 3:
                window.tutorialStep = 4;
                mouseDown = false;
                animDivs('.tutorial .second', '.tutorial .third');
                break;
              case 4:
                window.tutorialStep = 5;
                $('.tutorial').fadeOut(100, function() {
                  mouseDown = false;
                  startQuiz();
                });
                break;
              case 5:
                break;
            }
            return;
          }

          if (changeX > 50) {
            if (!$('.overlay').is(':visible')) { $('.overlay').show(); }

            // $('.yes_button img').css({'height': (scale+100) + "%", 'width': (scale+100) + "%"});
            $('.yes_button img').css({
                '-moz-transform': 'scale(' + (1+(scale/100)) + ')',
                '-webkit-transform': 'scale(' + (1+(scale/100)) + ')',
            });
            $('.agree').css({
                '-webkit-opacity': 'opacity(' + (scale/maxScale) + ')',
                '-moz-opacity': 'opacity(' + (scale/maxScale) + ')',
                'filter': 'alpha(opacity=' + (scale/maxScale) + ')',
                'opacity': ((scale*5)/100)
            });
            if (scale == maxScale) {
              vote = 'yes';
              // mouseDown = false;
            }
          } else if (changeX < -50) {
            if (!$('.overlay').is(':visible')) { $('.overlay').show(); }

            if (scale == maxScale) {
              vote = 'no';
              // mouseDown = false;
            }
            // $('.no_button img').css({'height': (scale+100) + "%", 'width': (scale+100) + "%"});
            $('.no_button img').css({
                '-moz-transform': 'scale(' + (1+(scale/100)) + ')',
                '-webkit-transform': 'scale(' + (1+(scale/100)) + ')'
            });
            $('.disagree').css({
                '-webkit-opacity': 'opacity(' + (scale/maxScale) + ')',
                '-moz-opacity': 'opacity(' + (scale/maxScale) + ')',
                'filter': 'alpha(opacity=' + (scale/maxScale) + ')',
                'opacity': ((scale*5)/100)
            });
          } else {
            vote = '';
          }
        }
      }
    }
  });

  $('body').bind('touchend', function(e) {
    // $('.no_button img, .yes_button img').css({'height': "100%", 'width': "100%"});
    $('.no_button img, .yes_button img').css({
        '-moz-transform': 'scale(1)',
        '-webkit-transform': 'scale(1)',
    });
    $('.agree, .disagree').css({
        '-webkit-opacity': 'opacity(0)',
        '-moz-opacity': 'opacity(0)',
        'filter': 'alpha(opacity=0)',
        'opacity': 0
    });
    $('.overlay').hide();
    mouseDown = false;
    if (vote == 'yes') {
      yes();
    } else if (vote == 'no') {
      no();
    }
    vote = '';
  });
}

function serializeVotes() {
  data = [];
  $.each(window.quizData.parties, function(index, party) { data.push({"party":party.slug, "votes":party.votes}) });
  return data;
}

function postAnonResults() {
  $.post('store.php', { "uuid": window.sessionId, "votes": JSON.stringify(serializeVotes())});
}

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}
