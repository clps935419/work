$(document).ready(function () {
    var inArticle = false;
    // The class you want to check:
    var parentClass = 'target';

    function checkParent(e) {
        if (e.parentElement && e.parentElement != $('body')) {
            if ($(e).hasClass(parentClass)) {
                inArticle = true;
                return true;
            } else {
                checkParent(e.parentElement);
            }
        } else {
            return false;
        }
    }

    $(document).on('mouseup', function () {
        // Check if there is a selection
        console.log(
          'window.getSelection()',
          window.getSelection().getRangeAt(0)
        );
        if (window.getSelection().type != 'None') {
            // Check if the selection is collapsed
            if (!window.getSelection().getRangeAt(0).collapsed) {
                inArticle = false;
                console.log(
                  '----',
                  window.getSelection().getRangeAt(0).startContainer.parentNode,
                  $(
                    window.getSelection().getRangeAt(0).startContainer
                      .parentNode
                  )
                );
                console.log(
                  'start',
                  window.getSelection().getRangeAt(0).startContainer
                    .parentElement,
                  'end',
                  window.getSelection().getRangeAt(0).endContainer
                    .parentElement,
                  $(
                    window.getSelection().getRangeAt(0).startContainer
                      .parentElement
                  )
                );
                    $(
                      window.getSelection().getRangeAt(0).startContainer
                        .parentElement
                    ).css('color','red').addClass('start');

                    $(
                      window.getSelection().getRangeAt(0).startContainer
                        .parentNode
                    )
                      .css('color', 'red')
                      .addClass('start');   

                    $(
                      window.getSelection().getRangeAt(0).endContainer
                        .parentElement
                    ).addClass('end')
                      .css('color', 'blue');
                    $(
                      window.getSelection().getRangeAt(0).endContainer
                        .parentNode
                    ).addClass('end')
                      .css('color', 'blue');


                      $('.start').nextUntil('.end').css('color','green');
                    
                // Check if selection has parent
                if (
                    window.getSelection().getRangeAt(0).commonAncestorContainer
                    .parentElement
                ) {
                    // Pass the parent for checking
                    checkParent(
                        window.getSelection().getRangeAt(0).commonAncestorContainer
                        .parentElement
                    );
                }

                if (inArticle === true) {
                    // If in element do something
                    // alert('You have selected something in the target element');
                }
            }
        }
    });
});
/**
 * @param {window object} win The window from which the selection is to be retrieved. This could also be an iframe.contentWindow.
 */
function getRangeObject(win) { //Gets the first range object. 
    win=win || window;
    if (win.getSelection) { // W3C/FF/Chrome/Safari/Opera/IE9
        return win.getSelection().getRangeAt(0);    //W3C DOM Range Object
    }
    else if(win.document.selection) { // IE8
        return win.document.selection.createRange(); //Microsoft TextRange Object
    }
    return null;
}

function getStartContainer(win) {
win=win || window;
    var range=getRangeObject(win);
    if(range) {
        if(range.startContainer) { // W3C/FF/Chrome/Safari/Opera/IE9
    console.log('測試---', range.startContainer);

            return range.startContainer;
        } else if(document.selection) { //IE8
            var rangeCopy=range.duplicate(); //Create a copy
            var rangeObj=range.duplicate();

            rangeCopy.collapse(true); //Go to beginning of the selection
        rangeCopy.moveEnd('character',1); //Select only the first character
            //Debug Message
            //alert(rangeCopy.text); //Should be the first character of the selection
            var parentElement=rangeCopy.parentElement();
            rangeObj.moveToElementText(parentElement); //Select all text of parentElement
            rangeObj.setEndPoint('EndToEnd',rangeCopy); //Set end point to the first character of the 'real' selection
            var text=rangeObj.text; //Now we get all text from parentElement's first character upto the real selection's first character

            //Iterate through all the child text nodes and check for matches
            //As we go through each text node keep removing the text value (substring) from the beginning of the text variable.
            var container=null;
            for(var node=parentElement.firstChild; node; node=node.nextSibling) {
                if(node.nodeType==3) {//Text node
                    var find=node.nodeValue;
                    var pos=text.indexOf(find);
                    if(pos==0 && text!=find) { //text==find is a special case
                        text=text.substring(find.length);
                    } else {
                        container=node;
                        break;
                    }
                }
            }
            range.startContainer=container; //Finally we are here
            //Debug Message
            //alert(container.nodeValue);
            console.log('找出start', range.startContainer);
        }
    }
}