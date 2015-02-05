'use strict';
angular.module('grammatist', ['ui.router','ngResource','firebase','model.users','model.categories','model.phrases'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('categories', {
        url: '/categories',
        templateUrl: 'app/categories/categories.html',
        controller: 'CategoriesCtrl',
        controllerAs: 'ctrl'
      })
      .state('phrase', {
        url: '/category/{categoryID}/phrase/{phraseID}',
        templateUrl: 'app/phrase/phrase.html',
        controller: 'PhraseCtrl',
        controllerAs: 'ctrl'
      })
      .state('auth', {
        url: '/auth',
        templateUrl: 'app/auth/auth.html',
        controller: 'AuthCtrl',
        controllerAs: 'vm'
      })
      .state('categories_crud', {
        url: '/admin/categories',
        templateUrl: 'app/admin/categories/categoriesCRUD.html',
        controller: 'CategoriesCRUDCtrl',
        controllerAs: 'ctrl'
      })
      .state('phrases_crud', {
        url: '/admin/phrases',
        templateUrl: 'app/admin/phrases/phrasesCRUD.html',
        controller: 'PhrasesCRUDCtrl',
        controllerAs: 'ctrl'
      });

    $urlRouterProvider.otherwise('/');
  });
