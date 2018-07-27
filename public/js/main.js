// Lägg till sökfunktion. Förslagsvis där "lägga till" finns just nu
// Rensa filter (sök)-knapp
// Presentera nytt förslag för "lägg till"
// Förstora "lägg till ny ingrediens"
// Klickar man på taggen så ska alla recept med ananas dyka updateDescription
// hovrar man på en tagg så ska en kryssruta dyka upp
// Lägg till rubrik på beskrivningsfältet till höger
// När man tar bort recept - lägg till "är du säker på det här?" Vill inte radera receptet av misstag


$(document).ready(function() {
  $('.recipe-name').on('click', deleteRecipe);
  $('.button').on('click', addRecipe);
  $('#nytt-recept').on('keypress', function(e){ e.keyCode===13 ? addRecipe() : false });
  $('.recipe-description').on('click', editDescription);
//  $('.recipe-description').on('click', updateDescription);
  $('.description-textarea').on('click', updateDescription);
  $('.add-ingredient').on('click', showIngredientInput);
  $('.ingredient-input').on('change', updateIngredients);
  $('.ingredient-box').on('click', removeIngredient);

});



function deleteRecipe() {
  fetch('/recept/delete/'+$(this).data('id'), { method:'DELETE' })
    .then(r => window.location.replace('/'))

  // $.ajax({
  //   type: 'DELETE',
  //   url: '/recept/delete/' + $(this).data('id'),
  //   complete: function() {
  //     console.log("testsuccessd");
  //     window.location.replace('/');
  //   },
  //   error: function() {
  //     console.log("error");
  //     window.location.replace('/');
  //   }
  // });
}

function addRecipe() {
  $.ajax({
    type: 'POST',
    url: '/recept/new/' + $('#nytt-recept').val(),
    complete: function() {
      console.log("testsuccessd");
      window.location.replace('/');
    },
    error: function() {
      console.log("error");
      window.location.replace('/');
    }
  });

}

function editDescription() {
  let currentText = $(this)[0].innerHTML;
  let objID = $(this)[0].parentElement.previousElementSibling.firstElementChild.dataset.id;
  let el = document.createElement("textarea");
  el.dataset.id = objID;
  el.classList.add("description-textarea");
  el.value = currentText;
  el.onchange = (e) => {updateDescription(e)};
  $(this)[0].parentElement.appendChild(el);
  $(this)[0].remove();
}

function updateDescription(e) {
  $.ajax({
    type: 'PUT',
    url: '/recept/update/description/',
    data: { id: e.target.dataset.id, description: e.target.value },
    complete: function() {
      console.log("testsuccessd");
      window.location.replace('/');
    },
    error: function() {
      console.log("error");
      window.location.replace('/');
    }
  });
//  window.location.replace('/');
}

/* OLD
function updateDescription() {
  console.log($(this)[0].parentElement.previousElementSibling.firstElementChild.dataset.id);
  $.ajax({
    type: 'PUT',
    url: '/recept/update/description/' + $(this)[0].parentElement.previousElementSibling.firstElementChild.dataset.id,
    complete: function() {
      console.log("testsuccessd");
    },
    error: function() {
      console.log("error");
    }
  });
  window.location.replace('/');
}
*/

/* OLD
function updateIngredients() {
  console.log($(this)[0].parentElement.parentElement.parentElement.firstElementChild.dataset.id);
  $.ajax({
    type: 'PUT',
    url: '/recept/update/ingredients/' + $(this)[0].parentElement.parentElement.parentElement.firstElementChild.dataset.id,
    complete: function() {
      console.log("testsuccessd");
    },
    error: function() {
      console.log("error");
    }
  });
  window.location.replace('/');
}
*/
function updateIngredients() {
  $.ajax({
    type: 'PUT',
//    data: { id: $(this)[0].parentElement.parentElement.parentElement.firstElementChild.dataset.id, ingredients: JSON.stringify(arr) },
    data: { id: $(this)[0].parentElement.parentElement.parentElement.firstElementChild.dataset.id, ingredients: $(this).val() },
    url: '/recept/update/ingredients/',
    complete: function() {
      console.log("testsuccessd");
      window.location.replace('/');
    },
    error: function() {
      console.log("error");
      window.location.replace('/');
    }
  });
}

function removeIngredient() {
  let ingredient = $(this)[0].innerHTML;
  let id = $(this)[0].parentElement.parentElement.firstElementChild.dataset.id;
  $.ajax({
    type: 'PUT',
    data: { id: id, ingredients: ingredient },
    url: '/recept/remove/ingredients/',
    complete: function() {
      console.log("testsuccessd");
      window.location.replace('/');
    },
    error: function() {
      console.log("error");
      window.location.replace('/');
    }
  });
}



function showIngredientInput() {
  $(this)[0].children[1].classList.remove('hidden');
  $(this)[0].children[1].focus();
}
