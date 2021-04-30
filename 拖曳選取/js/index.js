var sx;
var sy;
var ex;
var ey;
var ta;
var drag = false;

$(document).ready(function () {
    
  var dragArea = document.createElement('div');
  //dragArea.addClass("dragArea");
  dragArea.setAttribute('class', 'dragArea');
  document.body.appendChild(dragArea);
});

document.oncontextmenu = function () {
  return false;
};

$(document).on('mousemove', function (event) {
  if (drag) {
    var flipX = '';
    var flipY = '';
    var top = sy;
    var left = sx;
    var height = event.pageY - sy;
    var width = event.pageX - sx;

    if (event.pageX - sx < 0) {
      flipX = 'scaleX(-1)';
      width = sx - event.pageX;
      left = event.pageX;
    }

    if (event.pageY - sy < 0) {
      flipY = 'scaleY(-1)';
      height = sy - event.pageY;
      top = event.pageY;
    }

    $('.dragArea').attr(
      'style',
      'display:block; top:' +
        top +
        'px;  left:' +
        left +
        'px; width:' +
        width +
        'px; height: ' +
        height +
        'px; transform:' +
        flipX +
        ' ' +
        flipY +
        ';'
    );
  }
});

$(document).on('mousedown', function (event) {
  drag = true;
  sx = event.pageX;
  sy = event.pageY;

  switch (event.which) {
    case 1:
      //Left Mouse button pressed.
      $('.dragArea').addClass('add');
      $('.dragArea').removeClass('remove');
      break;
    case 3:
      //Right Mouse button pressed.
      $('.dragArea').addClass('remove');
      $('.dragArea').removeClass('add');
      break;
    default:
    //do nothing
  }
  $('.dragArea').attr(
    'style',
    'display:block; top:' +
      event.pageY +
      'px; left:' +
      event.pageX +
      'px; width:0; height:0;'
  );
});

$(document).on('mouseup', function (event) {
  console.log('up', event.which);

  drag = false;
  $('.dragArea').attr('style', 'display:none;');

  ex = event.pageX;
  ey = event.pageY;

  if (ex < sx) {
    ta = ex;
    ex = sx;
    sx = ta;
  }

  if (ey < sy) {
    ta = ey;
    ey = sy;
    sy = ta;
  }
  console.log('---', event.which);
  switch (event.which) {
    case 1:
      //Left Mouse button pressed. Check
      selectItems(true);
      break;
    case 3:
      //Right Mouse button pressed. Uncheck
      selectItems(false);
      break;
    default:
    //do nothing
  }
  $('.selectedArea').text(
    'X-Range:sx-' + sx + ':ex-' + ex + ' | Y-Range:sy-' + sy + ':ey-' + ey
  );
});

function selectItems(checked) {
  $('input[type=checkbox]').each(function () {
    var pos = $(this).offset();
    var cxLow = pos.left;
    var cxHi = pos.left + $(this).width();
    var cyLow = pos.top;
    var cyHi = pos.top + $(this).height();
    console.warn(
      'cxLow',
      cxLow,
      'cxHi',
      cxHi,
      'cyLow',
      cyLow,
      'cyHi',
      cyHi,
      'sx',
      sx,
      'sy',
      sy,
      'ex',
      ex,
      'ey',
      ey
    );
    if (cxLow <= sx && sx <= cxHi && cxLow <= ex && ex <= cxHi) {
      if (cyLow <= sy && sy <= cyHi && cyLow <= ey && ey <= cyHi) {
        $(this).prop('checked', !$(this).prop('checked'));
      } else {
        console.log('沒有2');
      }
    } else if (sx <= cxHi && ex >= cxLow) {
      if (sy <= cyHi && ey >= cyLow) {
        $(this).prop('checked', checked);
      } else {
        console.log('沒有1');
      }
    }else{
        console.log('沒有')
    }

    //alert("X: " + position.left + " | " + "Y: " + position.top)
  });
}
