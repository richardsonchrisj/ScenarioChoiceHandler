;(function(root) {
  // uncomment for some console.log debugging
  // root.TinCan.DEBUG = true;

  var tincan;
  var connected = false;

  var getUUID = root.TinCan.Utils.getUUID;
  var formatTime = root.TinCan.Utils.convertMillisecondsToISO8601Duration;
  var noop = Function.prototype;

  var state = {
    completed: false,
    completionFn: noop,
    prevDuration: null,
    score: null,
    startTime: null,
    suspend: '',
    loaded: {
      bookmark: false,
      duration: false,
      suspend: false,
    }
  }

  var BOOKMARK = 'bookmark';
  var SUSPEND_DATA = 'suspend_data';
  var TOTAL_TIME = 'cumulative_time';

  var COURSE = 'http://adlnet.gov/expapi/activities/course';
  var INTERACTION = 'http://adlnet.gov/expapi/activities/cmi.interaction';
  var LESSON = 'http://adlnet.gov/expapi/activities/module';
  var PROGRESSED = 'http://adlnet.gov/expapi/verbs/progressed';

  function isFile() {
    return /file/.test(root.location.protocol)
  }

  function assign(target) {
    if (target === undefined || target === null) {
      throw new TypeError('assign: Cannot convert undefined or null to object');
    }

    var output = Object(target);

    var source;
    var nextKey;

    for (var index = 1; index < arguments.length; index++) {
      source = arguments[index];

      if (source !== undefined && source !== null) {
        for (nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }

    return output;
  }

  function debounce(fn, delay) {
    var timer = null;

    return function () {
      var context = this, args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  function closeContent() {
    if(root.top === root) {
      root.close();
    }
    else {
      root.location.pathname =
        root.location.pathname
          .split('/')
          .slice(0, -1)
          .join('/')
          .concat('/goodbye.html');
    }
  }

  function sendStatement(attribs) {
    if(connected) {
      tincan.sendStatement(createStatement(attribs));
    }
  }

  function createStatement(stmt) {
    var definition = assign({}, {
      type: stmt.type || COURSE
    }, stmt.definition || {});

    var objectId = ([ tincan.activity.id ])
      .concat(stmt.id || [])
      .join('/');

    if(stmt.name) {
      definition.name = { und: stmt.name };
    }

    if(stmt.description) {
      definition.description = { und: stmt.description };
    }

    return {
      id: getUUID(),
      object: { id: objectId, definition: definition },
      objectType: 'Activity',
      result: stmt.result,
      verb: stmt.verb
    };
  }

  function createVerb(verbName) {
    var verb = new TinCan.Verb(verbName);

    if (verb.display.und) {
      verb.display['en-US'] = verb.display.und;
      delete verb.display.und;
    }

    return verb;
  }

  function sendAttempted() {
    commitFinishData({
      verb: createVerb('attempted')
    });
  }

  function sendExperienced(lessonId) {
    sendStatement({
      id: lessonId,
      type: LESSON,
      verb: createVerb('experienced')
    });
  }

  function sendProgressed(courseProgress) {
    commitFinishData({
      verb: createVerb({
        id: PROGRESSED,
        display: { 'en-US': 'progressed' }
      }),
      result: {
        extensions: {
          'http://w3id.org/xapi/cmi5/result/extensions/progress': courseProgress
        }}
    });
  }

  function addFinishData(stmt) {
    const result = assign({}, stmt.result);

    result.duration = formatTime(getDuration());
    result.completion = state.completed;

    if(state.score !== null) {
      result.score = state.score;
    }

    return assign({}, stmt, { result: result });
  }

  function getDuration() {
    state.prevDuration = state.prevDuration + ((new Date()).getTime() - state.startTime)
    state.startTime = (new Date()).getTime();

    return state.prevDuration;
  }

  function commitFinishData(stmt) {
    sendStatement(addFinishData(stmt));
  }

  function getState(key, cb) {
    if(connected) {
      if(typeof cb === 'function') {
        tincan.getState(key, {
          callback: function(err, result) {
            if(!err) {
              cb((result && result.contents) || '');
              return;
            }

            cb('');
          }
        });
        return;
      }

      try {
        var state =
          tincan.getState(key, cfg || {}).state;

        return state && state.contents
          ? state.contents
          : '';
      }
      catch(ex) {
        return '';
      }
    }

    // if not connected, call callback with blank state
    if(typeof cb === 'function') {
      cb('');
    }
  }

  function setState(key, data, cfg) {
    if(connected) {
      try {
        tincan.setState(key, data, cfg);
      }
      catch(ex) {
        return;
      }
    }
  }

  function FinishLesson(courseProgress, lessonId) {
    sendExperienced(lessonId);
    sendProgressed(courseProgress);
  }

  function SetBookmark(data) {
    setState(BOOKMARK, data, { callback: noop });
  }

  function SetDataChunk(data) {
    setState(SUSPEND_DATA, data, { callback: noop });
    setState(TOTAL_TIME, getDuration(), { callback: noop });
  }

  function GetDataChunk() {
    return state.suspend;
  }

  function SetScore(newScore, max, min) {
    state.score = {
      raw: newScore,
      max: max,
      min: min
    };
  }

  function InitCompletion(completedFn) {
    state.completedFn = completedFn;
  }

  function SetFailed() {
    state.completed = true;

    commitFinishData({
      result: { success: false },
      verb: createVerb('failed')
    });
  }

  function SetPassed() {
    state.completed = true;

    commitFinishData({
      result: { success: true },
      verb: createVerb('passed')
    });
  }

  // Record Answer Data
  function buildDescriptionObj(id, title) {
    return {
      id: id,
      description: {
        und: title
      }
    }
  }

  function prop(property) {
    return function (obj) {
      return obj[property];
    }
  }

  function mapMatchingArray(match) {
    return match.source.id + '[.]' + match.target.id;
  }

  function joinArray(a) {
    return a.join('[,]');
  }

  function getSources(answers) {
    var mapAnswers = function(answer) {
      return buildDescriptionObj(answer.source.id, answer.source.title);
    };

    return answers.map(mapAnswers);
  }

  function getTargets(answers) {
    var mapAnswers = function(answer) {
      return buildDescriptionObj(answer.target.id, answer.target.title);
    };

    return answers.map(mapAnswers);
  }

  function getChoices(answers) {
    var mapAnswers = function(answer) {
      return buildDescriptionObj(answer.id, answer.title);
    };

    return answers.map(mapAnswers);
  }

  function getCorrectResponsesPattern(data) {
    var correctResponse = data.correctResponse;

    switch (data.type) {
      case 'FILL_IN_THE_BLANK':
        return correctResponse;
      case 'MATCHING':
        return [ joinArray(correctResponse.map(mapMatchingArray)) ];
      case 'MULTIPLE_CHOICE':
      case 'MULTIPLE_RESPONSE':
      default:
        return [ joinArray(correctResponse.map(prop('id'))) ];
    }
  }

  function buildDefinition(data) {
    var answers = data.answers;
    var correctResponse = data.correctResponse;
    var type = data.type;

    var interactionTypes = {
      FILL_IN_THE_BLANK: 'fill-in',
      MATCHING: 'matching',
      MULTIPLE_CHOICE: 'choice',
      MULTIPLE_RESPONSE: 'choice'
    };

    var definition = {
      interactionType: interactionTypes[type || 'MULTIPLE_CHOICE'],
      correctResponsesPattern: getCorrectResponsesPattern(data)
    };

    if (type === 'MULTIPLE_CHOICE' || type === 'MULTIPLE_RESPONSE') {
      definition.choices = getChoices(answers);
    }

    if (type === 'MATCHING') {
      definition.source = getSources(answers);
      definition.target = getTargets(answers);
    }

    return definition;
  }

  function buildResponse(data) {
    var response = data.response;

    switch (data.type) {
      case 'FILL_IN_THE_BLANK':
        return response;
      case 'MATCHING':
        return joinArray(response.map(mapMatchingArray));
      case 'MULTIPLE_CHOICE':
      case 'MULTIPLE_RESPONSE':
      default:
        return joinArray(response.map(prop('id')));
    }
  }

  function ReportAnswer(data) {
    var definition = buildDefinition(data);
    var response = buildResponse(data);
    var title = data.questionTitle;

    sendStatement({
      definition: definition,
      description: title,
      id: data.id + '/' + data.itemId + '_' + Date.now(),
      name: title,
      result: {
        success: data.isCorrect,
        response: response
      },
      type: INTERACTION,
      verb: createVerb('answered')
    });
  }

  function ConcedeControl() {
    root.removeEventListener('beforeunload', ConcedeControl);
    closeContent();
  }

  function checkLoaded() {
    var loaded = state.loaded;

    if(loaded.bookmark && loaded.suspend && loaded.duration) {
      loadBundle();
    }
  }

  function initialize() {
    state.startTime =
      (new Date()).getTime();

    loadBookmark();
    loadSuspend();
    loadDuration();
  }

  function loadBookmark() {
    getState(BOOKMARK, function(hash) {
      if(hash) {
        if(root.history.pushState) {
          root.history.pushState(null, null, hash);
        } else {
          root.location.hash = hash;
        }
      }

      state.loaded.bookmark = true;
      checkLoaded();
    });
  }

  function loadDuration() {
    getState(TOTAL_TIME, function(duration) {
      state.prevDuration = Number(duration || 0);
      state.loaded.duration = true;
      checkLoaded();
    });
  }

  function loadBundle() {
    var script = document.createElement('script');
    script.setAttribute('src', 'lib/main.bundle.js');
    document.head.appendChild(script);

    sendAttempted();
  }

  function loadSuspend() {
    getState(SUSPEND_DATA, function(data) {
      if(data) {
        state.suspend = data;
        state.completed = state.completedFn();
      }

      state.loaded.suspend = true;
      checkLoaded();
    });
  }

  function lms() {
    root.removeEventListener('beforeunload', ConcedeControl);
    root.addEventListener('beforeunload', ConcedeControl);

    var url =
      root.location.href.replace(root.location.hash, '');

    var config = {
      activity: {
        id: TC_COURSE_ID,
        definition: {
          name: TC_COURSE_NAME,
          description: TC_COURSE_DESC
        }
      }
    }

    tincan = new TinCan(isFile()
      ? config
      : assign({}, config, { url: url })
    );

    connected = (tincan.recordStores || []).length;

    initialize();

    return {
      SetBookmark: SetBookmark,
      SetDataChunk: SetDataChunk,
      GetDataChunk: GetDataChunk,
      FinishLesson: FinishLesson,
      InitCompletion: InitCompletion,
      ReportAnswer: ReportAnswer,
      SetFailed: SetFailed,
      SetPassed: SetPassed,
      SetScore: SetScore,
      ConcedeControl: ConcedeControl,
      utils: {
        assign: assign,
        debounce: debounce
      }
    };
  }

  root.lms = lms;
}(window));
