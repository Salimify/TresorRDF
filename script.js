var x = ['2x2', '2x3']
var end = true;
var questionsArr = [];

//*********** PARSE from RDF ************ */

$(document).ready(function () {

  foafNS = "http://xmlns.com/foaf/0.1/";
  myRDF = new RDF();
  myRDF.getRDFURL('projet.rdf', function () {
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
})

window.onload = function () {

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
      if (i === 0 && j === 0) {
        var myspan = document.createElement('span');
        myspan.setAttribute("id", "start");
        myspan.classList.add('fas');
        myspan.classList.add('fa-home');
        td.classList.add('bg')
        td.appendChild(myspan)
      } else {
        var myspan = document.createElement('span');
        myspan.classList.add('fas');
        myspan.classList.add('fa-question');
        myspan.style.opacity = '0.2'
        td.appendChild(myspan)
      }
      /*if(i+'x'+j===x[0] || i+'x'+j===x[1]){
          td.style.border = 'solid'
          td.style.borderColor = 'red';
      }*/
      tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl)
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

        console.log(questionsArr[0].question)
        $('#question').text(questionsArr[0].question+"")
        $('#enonce').text(questionsArr[0].ennonce+"")
        var res = questionsArr[0].reponses.split(";");
        console.log(res);
        for(i=0;i<res.length;i++){
        $('#reponses').append(
          "<input type='radio' value= '"+res[i]+"' name='reponses' /> "+ res[i] +"<br>"
        )
        }
        $('.modal').modal( {backdrop: 'static', keyboard: false}); 
        $('.modal').modal('show'); 
       
      }

      if ($(this).closest('tr').attr('id') == Math.floor(Math.random() * 20)) {
        $(this).closest('td').append('<span class="fas fa-bomb"></span>')
        end = false;
        $('#result').addClass('red')
        $('#result').text('Game Over! You lost!!!')
        $('#mytable').addClass('losecolor');
        $('#replay').removeAttr('hidden')
        $('#gameover')[0].play()

      } else {
        if (!$(this).closest('td').hasClass('bg')) {
          var current = parseInt($('#scorenumber').text());
          current = current + 10;
          $('#scorenumber').text(current)
        }
      }
      $(this).closest('td').find('span').removeClass('fa-question')
      $(this).closest('td').addClass('bg')
      $('#error')[0].play()

    }
  });

})
function replay() {
  location.reload();
}
$(document).ready(function () {
  $('#loop')[0].play()
});

