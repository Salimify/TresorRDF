var x = ['2x2', '2x3']
var end = true;
var questionsArr = [];

//*********** PARSE from RDF ************ */
window.onload = function () {

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

  //************** RDF SCRIPT ************** */
  foafNS = "http://xmlns.com/foaf/0.1/";
  myRDF = new RDF();
  myRDF.getRDFURL('projet.rdf', function () {
    /******Case Depart */
    var tr = myRDF.Match(null, "http://www.fil.univ-lille1.fr/~caronc/WS/data#caseDepart", null, null);
    var id = tr[1].object + "";
    createCells(id);
    createStart(id);
    /******Get Question from RDF */
    var str = "";
    for (var i = 1; i < 5; i++) {
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
    console.log($(this));
    $('#loop')[0].play()

    //alert($(this).closest('td').attr('id'));
    if (end == true) {

      if ($(this).closest('td').attr('id') == '4x4') {
        $(this).closest('td').append('<span class="fas fa-gift"></span>')
        end = false;
        $('#result').addClass('green')
        $('#result').text('Congrats!! YOU Won!!!!!!!!!')
        $('#loop')[0].pause();
        $('#win')[0].play()
        $('#mytable').addClass('wincolor');
        $('#replay').removeAttr('hidden')
      }

      if ($(this).closest('td').attr('id') == '3x3') {

        $('.modal').modal({ backdrop: 'static', keyboard: false });
        $('.modal').modal('show');
        console.log(questionsArr[0])
        $('#question').text(questionsArr[0].question + "")
        $('#enonce').empty()
        $('#enonce').text(questionsArr[0].ennonce + "")
        var res = questionsArr[0].reponses.split(";");
        console.log(res);

        for (i = 0; i < res.length; i++) {
          $('#reponses').append(
            "<input type='radio' value= '" + i + "' name='reponses' /> " + res[i] + "<br>"
          )
        }
        $("input[type='submit']").click(function () {
          var radioValue = $("input[name='reponses']:checked").val();
          if (radioValue) {
            if (radioValue === questionsArr[0].correcte) {
              $('.modal').modal('hide');
            } else {
              calculateScore(-10);
              var current = parseInt($('#tentative').text());
              current = current + 1;
              if (current == 3) {
                $('.modal').modal('hide');
                endGame('3x3');
              }
              $('#tentative').text(current).addClass('red')
            }

          }
        });


      }
      $(this).closest('td').find('span').removeClass('fa-question')
      $(this).closest('td').addClass('bg')
      $('#error')[0].play()

    }
  });

})

function endGame(id) {
  $('#' + id).append('<span class="fas fa-bomb"></span>')
  end = false;
  $('#result').addClass('red')
  $('#result').text('Game Over! You lost!!!')
  $('#mytable').addClass('losecolor');
  $('#replay').removeAttr('hidden')
  $('#gameover')[0].play()

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

function createCells(id){
  for(var i=0; i<5; i++){
    for(var j=0; j<5; j++){
        td = document.getElementById(i+"x"+j)
        var myspan = document.createElement('span');
        myspan.classList.add('fas');
        myspan.classList.add('fa-question');
        myspan.style.opacity = '0.2'
        td.appendChild(myspan)
    }
  }
}
function calculateScore(number) {
  var current = parseInt($('#scorenumber').text());
  current = current + number;
  $('#scorenumber').text(current)
}
function replay() {
  location.reload();
}

