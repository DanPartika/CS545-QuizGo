const activities = require('./data/activities');
const list = require('./data/list');
const users = require('./data/users');
const connection = require('./config/mongoConnection');

const main = async () => 
{
    const db = await connection.dbConnection();
    await db.dropDatabase();

// name, 
// username, 
// words, 
// definitions, 
// numCorrect, 
// numIncorrect

// firstName, lastName, email, username, password

    try
    {
        let user1 = await users.createUser("Cody","Fernandez","cfernan2@stevens.edu","CodyF02","Mememaster!3");
        let user2 = await users.createUser("Daniel","Partika","dpartika@stevens.edu","Dan1","Password1!");
        let user3 = await users.createUser("Elton","Vaz","evaz@stevens.edu","eltonvaz623","Eltonv#05");
        let user4 = await users.createUser("Hari","Shankar","srishankar@stevens.edu","SriBL","CodyMan%!4");
        let user5 = await users.createUser("Tahyr","Bay","tbay22@stevens.edu","TayBay","Arsenal@2");

        let list1 = await list.createList("Presidents","Dan1",["1st President", "2nd President", "3rd President", "44th President", "45th President", "46th President"],["George Washington", "John Adams", "Thomas Jefferson", "Barack Obama", "Donald Trump", "Joe Biden"], 0, 0);
        let list2 = await list.createList("Basketball Teams","eltonvaz623",["Brooklyn", "Chicago", "Boston", "New York", "Philadelphia", "Los Angeles", "Miami", "Dallas", "Golden State"],["Nets", "Bulls", "Celtics", "Knicks", "76ers", "Lakers", "Heat", "Mavericks", "Warriors"], 0, 0);
        let list3 = await list.createList("Best Soccer Player","TayBay",["Argentina", "Portugal", "Brazil", "France", "Norway"],["Messi", "Ronaldo", "Neymar", "Mbappe", "Haaland"], 0, 0);

    } 
    catch (e) 
    {
      console.log(e);
    } 
    
      
    await connection.closeConnection();

}

main();