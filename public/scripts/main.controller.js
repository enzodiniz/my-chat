angular
  .module('BlankApp')
  .controller('mainCtrl', mainCtrl);

function mainCtrl($scope) {
  var self = this;

  // flag que indica se está logado
  self.loggedIn = false;
  // usuário atual
  self.user;

  self.mensagens;
  self.msg = "";

  self.initFirebase = function() {
    // atalhos para auth e firestore
    self.auth = firebase.auth();
    self.db = firebase.firestore();

    // listener para quando o estado de autenticação mudar
    self.auth.onAuthStateChanged(self.onAuthStateChanged.bind(this));
  }

  // função para quando o estado de autenticação mudar
  self.onAuthStateChanged = function(user) {
    $scope.$apply(function() {
      if (user) {
        self.loggedIn = true;

        self.user = {
          nome: user.displayName,
          photo: user.photoURL,
          id: user.uid
        };
      } else {
        self.loggedIn = false;
        self.user = null;
      }
    });
  }

  self.autenticar = function() {
    // provedor do Google
    let provider = new firebase.auth.GoogleAuthProvider();

    self.auth.signInWithPopup(provider).then(function (result){
      console.log('logado');
    }).catch(function (error) {
      console.log('erro no login');
    });
  }

  self.logout = function() {
    self.auth.logout().then(function() {
      self.loggedIn = false;
    });
  }

  // Salvar uma mensagem
  self.send = function() {
    console.log('salvando...');
    
    self.db.collection('mensagens').add({
      nome: self.user.nome,
      photoURL: self.user.photo,
      texto: self.msg
    }).then(function() {
      console.log('enviado');
      self.msg = "";
    }).catch(e => console.error('Erro ao enviar uma mensagem: ', e));
  }

  self.initFirebase();
}
