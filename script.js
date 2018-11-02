var x = ['2x2', '2x3']
var end = true;
var disabled = [];
var questionsArr = [];
var piegesArr = [];
var portesArr = [];
var doorOpenedNbr = 0;
var closedRooms = [
  { "0": false },
  { "1": true },
  { "2": true },
  { "3": true },
  { "4": true }
]

//*********** PARSE from RDF ************ */
window.onload = function () {
  console.log(closedRooms)
  //************* Create MAtrix */
  var body = document.getElementById('mydiv');
  var tbl = document.createElement('table');

  tbl.style.width = '100%';
  tbl.style.height = '50vh'
  tbl.style.textAlign = 'center';
  tbl.setAttribute('border', '1');
  var tbdy = document.createElement('tbody');
  tbdy.id = 'mytable';
  for (var i = 0; i < 5; i++) {
    var tr = document.createElement('tr');
    tr.id = i;
    for (var j = 0; j < 5; j++) {

      var td = document.createElement('td');
      td.appendChild(document.createTextNode('\u0020'))
      td.id = i + 'x' + j;
      tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
  activeRoom()
  //************** RDF SCRIPT ************** */
  foafNS = "http://xmlns.com/foaf/0.1/";
  myRDF = new RDF();
  myRDF.getRDFURL('projet.rdf', function () {
    /******Case Depart */
    var tr = myRDF.Match(null, "http://www.fil.univ-lille1.fr/~caronc/WS/data#start", null, null);
    var id = tr[1].object + "";
    createCells(id);
    createStart(id);

    /****** get piéges */
    for (var i = 1; i < 8; i++) {
      var tr2 = myRDF.Match(null, "http://www.fil.univ-lille1.fr/~caronc/WS/data#piege" + i, null, null);
      var piegeArr = []
      piegeArr["case"] = tr2[2].object
      piegeArr["penalite"] = tr2[3].object
      piegesArr.push(piegeArr)
    }
    markPieges()
    /***** get portes */

    for (var i = 1; i < 7; i++) {
      var tr2 = myRDF.Match(null, "http://www.fil.univ-lille1.fr/~caronc/WS/data#Porte" + i, null, null);
      var porteArr = []
      porteArr["case"] = tr2[2].object
      porteArr["recompense"] = tr2[3].object
      portesArr.push(porteArr)
    }
    console.log(portesArr)
    markPortes()
    /******Get Question from RDF */
    var str = "";
    for (var i = 1; i < 7; i++) {
      var triplet = myRDF.Match(null, "http://www.fil.univ-lille1.fr/~caronc/WS/data#question" + i, null, null);
      var questionArr = [];
      questionArr["question"] = triplet[1].object;
      questionArr["ennonce"] = triplet[2].object;
      questionArr["reponses"] = triplet[5].object;
      questionArr["correcte"] = triplet[6].object;
      questionsArr.push(questionArr);
    }
    console.log(questionsArr)
  });

}



function addBg(e) {
  var el = $(this);
  el.addClass('bg');
  setTimeout(function () {
    removeBg(el);
  }, 10 * 1000); //<-- (in miliseconds)
};

var removeBg = function (el) {
  $(el).removeClass('bg');
};

$(function () {
  $(document).on('click', '#mytable td', function (event) {
    $("#tentative").val(0)
    var row = $(this).closest('td').attr('id')
    row = row.substring(0, 1)
    console.log(row + "aaaa")
    $('#loop')[0].play()
    activeRoom()
    disabled.push("4x4")
    disabled.push("0x0")
    //alert($(this).closest('td').attr('id'));
    if (end == true) {
      var qtId = parseInt(row);
      var caseId = $(this).closest('td').attr('id');
      if (!disabled.includes(caseId) && closedRooms[row][row] == false) {
        console.log(caseId)
        portes = markPortes();
        console.log(portes.includes(caseId))
        if (portes.includes(caseId)) {
          $('#question')[0].play()
          $('.modal').modal({ backdrop: 'static', keyboard: false });
          $('.modal').modal('show');
          console.log(questionsArr[qtId])
          $('#enonce').empty()
          $('#reponses').empty()
          $('#question').empty()
          $('#question').text(questionsArr[qtId].question + "")
          $('#enonce').text(questionsArr[qtId].ennonce + "")
          var res = questionsArr[qtId].reponses.split(";");
          console.log(res);
          
          for (i = 0; i < res.length; i++) {
            $('#reponses').append(
              "<input type='radio' value= '" + i + "' name='reponses' /> " + res[i] + "<br>"
            )
          }
          var tentative = parseInt($("#tentative").val())
          $("input[type='submit']").click(function () {
            tentative = 1+tentative;
            console.log(tentative)
            var radioValue = $("input[name='reponses']:checked").val();
            if (radioValue) {
              if (radioValue === questionsArr[qtId].correcte) {
                markSuccessDoor(caseId);
                $("#tentative").empty();
                $("#tentative").val(0);
                $('.modal').modal('hide');
                for (var i = 0; i < 6; i++) {
                  var arr = portesArr[i];
                  if (arr.case == caseId) {
                    calculateScore(arr.recompense)
                    disabled.push(caseId)
                    break;
                  }
                }
                
                if(caseId == "4x3"){
                  treasureFound();
                }
              } else {
                calculateScore(-10);
                if ( parseInt($("#tentative").val()) == 3) {
                  $('.modal').modal('hide');
                  endGame(caseId);
                }
                $('#tentative').text(tentative).addClass('red')
              }

            }
          });


        } else {
          pieges = markPieges()
          if (pieges.includes(caseId)) {
            for (var i = 0; i < 6; i++) {
              var arr = piegesArr[i];
              if (arr.case == caseId) {
                calculateScore(arr.penalite)
                disabled.push(caseId)
                break;
              }
            }
            $('#fire')[0].play()
            markPiegeDoor(caseId);

          } else {
            markNormal(caseId)
            calculateScore(5);
            disabled.push(caseId)
            $('#error')[0].play()

          }
        }
        $(this).closest('td').find('span').removeClass('fa-question')
        $(this).closest('td').addClass('bg')
      }

    }
  });

})

function endGame(id) {
  $("#" + id).empty()
  $('#' + id).append('<span class="fas fa-bomb"></span>')
  end = false;
  $('#result').addClass('red')
  $('#result').text('Game Over! You lost!!!')
  $('#mytable').addClass('losecolor');
  $('#replay').removeAttr('hidden')
  $('#gameover')[0].play()

}

function activeRoom() {
  console.log("******active")
  for (var i = 0; i < 5; i++) {
    if (closedRooms[i][i] == false) {
      for (var j = 0; j < 5; j++) {
        $("#" + i + "x" + j).addClass("active")
      }
    }
  }
}
function createStart(id) {
  console.log(id + "aaaaaaa");
  $("#" + id).empty()
  var myspan = document.createElement('span');
  myspan.setAttribute("id", "start");
  myspan.classList.add('fas');
  myspan.classList.add('fa-home');
  $("#" + id).append(myspan).addClass('bg')
}

function markPieges() {
  var cases = []
  for (var i = 0; i < 7; i++) {
    cases.push(piegesArr[i].case)
  }
  return cases

}

function markPortes() {
  var portes = []
  for (var i = 0; i < 6; i++) {
    portes.push(portesArr[i].case)
  }
  return portes;

}

function markSuccessDoor(id) {
  $("#" + id).empty()
  $("#" + id).append('<i class="fas fa-door-open"></i>')
  var srow = parseInt(id.substring(0, 1));
  if ((srow + 1) < 5) {
    closedRooms[srow + 1][srow + 1] = false;
  }
  activeRoom()
  console.log(closedRooms)
}

function markPiegeDoor(id) {
  $("#" + id).append('<i class="fas fa-skull-crossbones"></i>')
  $("#" + id).addClass('danger')
}

function markNormal(id) {
  $("#" + id).append('<i class="fas fa-smile-beam"></i>')
  $("#" + id).addClass('normal')
}

function createCells(id) {
  for (var i = 0; i < 5; i++) {
    for (var j = 0; j < 5; j++) {
      td = document.getElementById(i + "x" + j)
      var myspan = document.createElement('span');
      myspan.classList.add('fas');
      myspan.classList.add('fa-question');
      myspan.style.opacity = '0.2'
      td.appendChild(myspan)
    }
  }
}

function treasureFound(){
  $("#4x4").empty()
  $("#4x4").append('<span class="fas fa-gift"></span>')
  end = false;
  $('#result').addClass('green')
  $('#result').text('Congrats!! YOU Won!!!!!!!!!')
  $('#loop')[0].pause();
  $('#win')[0].play()
  $('#mytable').addClass('wincolor');
  $('#replay').removeAttr('hidden')
}
function calculateScore(number) {
  var current = parseInt($('#scorenumber').text());
  current = current + parseInt(number);
  $('#scorenumber').text(current)
}
function replay() {
  location.reload();
}

