angular.module('model.phrases',[])
  .service('Phrases', Phrases)
  .service('PhrasesUtils', PhrasesUtils);

function Phrases(FIREBASE_URI, $resource, AuthParams){
  var url = FIREBASE_URI+'/phrases.json';
  function REST(restUrl){
    restUrl = restUrl || url;
    return $resource(restUrl,{},{
      update: {method:'PUT', params: AuthParams()},
      save: {method:'POST', params: AuthParams()},
      delete: {method:'DELETE', params: AuthParams()}
    });
  }
  return {
      getAll:getAllPhrases,
      add: addPhrase,
      save: savePhrase,
      delete: deletePhrase,
      get:getPhrasesByCategoryID,
      getEmptyPhrase: getEmptyPhrase

    };

  function getEmptyPhrase(){
    return {
      "textRus":"",
      "textEn":"",
      "categoryID":""
    };
  }

  function addPhrase(newPhrase){
     newPhrase = newPhrase || getEmptyPhrase();

    return REST().save(newPhrase);
  }

  function deletePhrase(phraseID){
    return REST(FIREBASE_URI+'phrases/'+phraseID+'.json').delete();
  }

  function savePhrase(phraseID, phrase){
    phrase = phrase || getEmptyPhrase();
    return REST(FIREBASE_URI+'phrases/'+phraseID+'.json').update(phrase);
  }

  function getPhrasesByCategoryID(categoryID){
    return REST(FIREBASE_URI+'phrases.json?').get({
      orderBy:'"categoryID"',
      startAt:'"'+categoryID+'"',
      endAt:'"'+categoryID+'~"'
    });
  }

  function getAllPhrases(){
    return REST().get();
  }
}



function PhrasesUtils() {
  return {
    toArray: phrasesToArray
  };

  function phrasesToArray(phrases) {
    return _.compact(_.map(phrases, function (value, index) {
      if (_.first(index) === '$') {
        return undefined;
      } else {
        value.phraseID = index;
        return value;
      }
    }))
  }
}
