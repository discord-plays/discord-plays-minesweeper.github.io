// I just love stackoverflow
// https://stackoverflow.com/questions/12982156/select-copy-text-using-javascript-or-jquery/34503498
function copy_text(element) {
  //Before we copy, we are going to select the text.
  var text = document.getElementById(element);
  var selection = window.getSelection();
  var range = document.createRange();
  range.selectNodeContents(text);
  selection.removeAllRanges();
  selection.addRange(range);
  //add to clipboard.
  document.execCommand('copy');
  $(text).notify("Copied start command", "success");
}

function decompile_code() {
  var str = $("#inputgeneratorcode").val();
  str = str.replace(/^.start /, '');
  var raw = LZString.decompressFromEncodedURIComponent(str);
  var data = {};
  try {
    data = JSON.parse(raw);
  } catch (err) {
    $("#inputgeneratorcode").notify("Error reading this generator code", "error");
    return;
  }
  var json = {
    m: {},
    ...data
  };
  var k = Object.keys(json.m);
  $(".mines-num").val('');
  for (var i = 0; i < k.length; i++) {
    $(".mines-num[num=" + k[i] + "]").val(json.m[k[i]]);
  }
  $(".board-num").val('');
  for (var i = 0; i < k.length; i++) {
    $(".board-num[num=" + k[i] + "]").val(json.b[k[i]]);
  }
  $("#inputgeneratorcode").notify("Loaded data from generator code", "success");
  generate_code();
}

function generate_code() {
  var data = {
    m: {},
    b: {}
  }
  var $mines = $(".mines-num")
  for (var i = 0; i < $mines.length; i++) {
    try {
      var j = parseInt($($mines[i]).val());
      if (j > 0 && j != null) {
        data.m[$($mines[i]).attr('num')] = j;
      }
    } catch (err) {
      /* ignore this? */
    }
  }
  var $board = $(".board-num")
  for (var i = 0; i < $board.length; i++) {
    try {
      var j = parseInt($($board[i]).val());
      if (j > 0 && j != null) {
        data.b[$($board[i]).attr('num')] = j;
      }
    } catch (err) {
      /* ignore this? */
    }
  }
  $("#outputgeneratorcode").text(">start " + LZString.compressToEncodedURIComponent(JSON.stringify(data)));
}

$(document).ready(function () {
  $("#inputgeneratorbutton").click(decompile_code);
  $(".mines-num").on('keyup', generate_code);
  $(".board-num").on('keyup', generate_code);
})