require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { db, close } = require('./database');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const clearUsers = () => {
  db.run('DELETE FROM users', function(err) {
    if (err) {
      console.error("Erro ao limpar a tabela de usuários:", err.message);
    } else {
      console.log(`Todos os usuários foram removidos. ${this.changes} contas deletadas.`);
      // Opcional: Resetar o autoincremento para começar do 1 novamente
      db.run("DELETE FROM sqlite_sequence WHERE name='users'", (err) => {
        if (err) {
          console.error("Erro ao resetar o autoincremento:", err.message);
        } else {
          console.log("Autoincremento da tabela de usuários resetado.");
        }
        close();
        rl.close();
      });
    }
  });
};

console.log("\x1b[31m%s\x1b[0m", "ATENÇÃO: Esta ação é irreversível e irá deletar TODOS os usuários do banco de dados.");
rl.question("Você tem certeza que deseja continuar? (sim/não): ", (answer) => {
  if (answer.toLowerCase() === 'sim') {
    console.log("Iniciando limpeza do banco de dados...");
    clearUsers();
  } else {
    console.log("Operação cancelada.");
    rl.close();
    close();
  }
});
