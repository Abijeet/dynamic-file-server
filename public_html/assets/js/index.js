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
    'Hi there! We\'re getting married on the 20th of March, 2016, and are',
    'having a small celebration at Vijayawada to mark the ocassion.',
    'We would love to have you with us on that day at 9:30 in the evening.',
    '',
    'The event will be held at Ilapuram Convention Hall.',
    'Gandhi Nagar, Hanumanpet,',
    'Vijayawada - 520003',
    ECHO_START_CHAR + 'Google map - https://goo.gl/WFf5wl',
    '',
    'With love,',
    'Sravani & Abijeet.'
  ];
  var PROMPT_MSG = '> ';
  var CHAR_DELAY = 70;
  var DEF_HELP_CMD = '\nType "help" to list commands...';

  var currLine = 0;
  var currWord = 0;
  var typedMessage = '';
  var primTimeout = null;
  var _term = null;

  $('#term').terminal(function(command, term) {
    console.log(command);
    if(command === 'help') {
      return showHelp(term);
    } else if(command === 'quit') {
      return closeTerminal(term);
    } else if(command === 'play') {
      reInit();
      term.set_prompt('');
      term.clear();
      insert(term, TERM_LINE);
      showMessage(term);
    } else if(command === 'credits') {
      return showCredits(term);
    } else {
      term.echo('Unknown command. ' + DEF_HELP_CMD);
    }
  }, {
    prompt: '',
    name: 'Wedding invitation',
    greetings: '',
    onInit: function(term) {
      _term = term;
      insert(term, TERM_LINE);
      showMessage(term);
    },
    convertLinks: true
  });

  function showMessage(term) {
    typeMessage(term, MSG[currLine], CHAR_DELAY, function() {
      ++currLine;
      if(currLine === MSG.length) {
        echoContent(term, '');
        reInit();
        term.set_prompt(PROMPT_MSG);
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

    primTimeout = setTimeout(function() {
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
    typedMessage = '';
    currWord = 0;
    currLine = 0;
    if(primTimeout) {
      clearTimeout(primTimeout);
      primTimeout = null;
    }
  }

  function showHelp(term) {
    term.echo('\nWelcome to the Wedding invitation app.\nFollowing commands are currently supported -' );
    term.echo('1. help' );
    term.echo('2. play' );
    term.echo('3. credits' );
    term.echo('4. quit' );
    term.echo('\n');
  }

  function closeTerminal(term) {
    if(!term) {
      term = _term;
    }
    var $termContainer = $('.term-container');
    $termContainer.fadeOut(200, function() {
      term.clear();
      term.destroy();
    });
    term.pause();
    reInit();
    $termContainer.trigger('close');
  }

  function showCredits(term) {
    term.echo(' ');
    term.echo('Following open source projects have been used to create this page - ');
    term.echo(TERM_LINE);
    term.echo('jQuery - http://jquery.com/');
    term.echo('jQuery terminal - http://terminal.jcubic.pl/');
    term.echo('underscore.js - http://underscorejs.org/');
    term.echo('express - http://expressjs.com/');
    term.echo('node.js - https://nodejs.org/');
    term.echo('ejs - http://ejs.co/');
    term.echo(TERM_LINE);
    term.echo('Images');
    term.echo(TERM_LINE);
    term.echo('Powerpuff girls phone - http://goo.gl/2nqRE6');
    term.echo('Blossom DJ - http://goo.gl/hPBFaw');
    term.echo(' ');
  }

  return {
    close: closeTerminal
  };
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
  var TERMINAL_OPEN_DELAY = 800;
  var isStarted = false;
  var $termContainer = $('.term-container');
  var $mainBody = $('.main-body');
  var $iconTerminal = $('#iconTerminal');
  var $btnWeddingInvitation = $('#btnWeddingInvitation');
  var $blossomImg = $mainBody.find('.blossom-img');
  var mainTerm = null;

  $btnWeddingInvitation.click(function() {
    if(isStarted) {
      alert('Wedding invitation is already running!');
      return;
    }
    isStarted = true;
    // Show Blossom and show the terminal icon.
    $blossomImg.fadeIn(250);
    $iconTerminal.removeClass('hide');

    // Change the image soruce to a PNG file to stop the image from blinking.
    changeImg($(this), 'png');

    // Open the terminal after a small delay.
    setTimeout(function() {
      setTimeout(function() {
        mainTerm = Terminal();
      }, 160);
      $termContainer.fadeIn(250);
    }, TERMINAL_OPEN_DELAY);
  });

  $termContainer.on('close', function() {
    isStarted = false;
    $blossomImg.fadeOut(250);
    $iconTerminal.addClass('hide');
    changeImg($btnWeddingInvitation, 'gif');
  });

  $termContainer.find('.close').click(function() {
    if(mainTerm) {
      mainTerm.close();
      mainTerm = null;
    }
    $termContainer.trigger('close');
  });

  function changeImg($container, imgType) {
    var $img = $container.find('img');
    var currSrc = $img.attr('src');
    var targetSrc = currSrc.slice(0, currSrc.length - 3) + imgType;
    $img.attr('src', targetSrc);
  }
}