/* global $ */
'use strict';

$(function() {
  initTime();
  initApp();
});

var Terminal = function() {
  var ECHO_START_CHAR = '!~';
  var TERM_LINE = '-------------------------------------------------------------------------';
  var MSG = [
    'We would like to invite you to our wedding on the 20th of March, 2016.',
    'We\'re having a small celebration at Vijayawada to mark the ocassion.',
    'We would love to have you with us on that day at 9:30 in the evening.',
    '',
    'The event will be held at Ilapuram Convention Hall.',
    'Gandhi Nagar, Hanumanpet,',
    'Vijayawada - 520003',
    ECHO_START_CHAR + 'Google Map - https://goo.gl/WFf5wl',
    '',
    'With love,',
    'Sravani & Abijeet.'
  ];
  var currLine = 0;
  var currWord = 0;
  var typedMessage = '';

  $('#term').terminal(function(command, term) {

  }, {
    prompt: '',
    name: 'Wedding invitation',
    greetings: '',
    onInit: function(term) {
      insert(term, TERM_LINE);
      showMessage(term);
    },
    convertLinks: true
  });

  function showMessage(term) {
    typeMessage(term, MSG[currLine], 10, function() {
      ++currLine;
      if(currLine === MSG.length) {
        echoContent(term, '');
        reInit();
        return;
      }
      showMessage(term);
    });

  }

  function typeMessage(term, message, delay, finish) {
    if(message.length <= 0) {
      insert(term, '\n', false);
      finish();
      return;
    }

    if(currWord === 0 && message.indexOf(ECHO_START_CHAR) === 0) {
      // currWord check is only to make things wee-bit faster.
      var msgToDisplay = message.slice(ECHO_START_CHAR.length, message.length);
      echoContent(term, msgToDisplay);
      finish();
      return;
    }

    setTimeout(function() {
      insert(term, message[currWord], false);
      ++currWord;
      if(currWord === message.length) {
        currWord = 0;
        insert(term, '\n', false);
        return finish();
      }
      typeMessage(term, message, delay, finish);
    }, delay);
  }

  function insert(term, msg, addNewLine) {
    if(addNewLine !== false) {
      addNewLine = true;
    }
    if(addNewLine) {
      var finalMsg = msg + '\n';
      typedMessage += finalMsg;
      term.insert(finalMsg);
    } else {
      typedMessage += msg;
      term.insert(msg);
    }
  }

  function echoContent(term, message) {
    typedMessage += message + '\n';
    term.clear();
    term.set_command('');
    term.echo(typedMessage);
  }

  function reInit() {

  }
};

function initTime() {
  var $currTime = $('#currTime');

  function showTime() {
    var time = getFormattedTime();
    $currTime.html(time);
    setTimeout(showTime, 300);
  }

  function getFormattedTime() {
    var dt = new Date();
    var month = normalizeToTwo(dt.getMonth() + 1);
    var year = dt.getFullYear();
    var date = normalizeToTwo(dt.getDate());
    var hours = normalizeToTwo(dt.getHours());
    var mins = normalizeToTwo(dt.getMinutes());

    return year + '-' + month + '-' + date + ' ' + hours + ':' + mins;
  }

  function normalizeToTwo(value) {
    if(value < 10) {
      return '0' + value;
    }
    return value;
  }

  showTime();
}


function initApp() {
  var isStarted = false;
  $('#btnWeddingInvitation').click(function() {
    if(isStarted) {
      alert('Wedding invitation is already running!')
      return;
    }
    isStarted = true;
    $('.main-body').css('background-image', 'url("assets/img/blossom-dj.png")');
    setTimeout(function() {
      $('.term-container').fadeIn(250, function() {
        Terminal();
      });
    }, 1000);
  })
}