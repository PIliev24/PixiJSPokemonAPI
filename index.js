var express = require("express");
var app = express();
const fetch = require("node-fetch");
app.use(express.static(__dirname + "/services"));

// set the view engine to ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.get("/battle/:pokeNumber", async (req, res) => {
  var initialUrl = "https://pokeapi.co/api/v2/pokemon/" + req.params.pokeNumber;
  let pokemonData = await fetchPokemonData(initialUrl);
  let moves = pokemonData.moves,
    stats = pokemonData.stats;

  var enemyUrl = "https://pokeapi.co/api/v2/pokemon/" + getRandomInt(1, 20);
  let pokemonDataEnemy = await fetchPokemonData(enemyUrl);
  let statsOpponent = pokemonDataEnemy.stats;

  res.render("battle", {
    imageUrl: pokemonData.sprites.back_default,
    name: pokemonData.name,
    ability: getAbility(pokemonData.abilities),
    moveOne: moves[0].move.name,
    moveTwo: moves[1].move.name,
    moveThree: moves[2].move.name,
    moveFour: moves[3].move.name,
    speed: stats[5].base_stat,
    defense: stats[2].base_stat,
    attack: stats[1].base_stat,
    hp: stats[0].base_stat,
    enemyImageUrl: pokemonDataEnemy.sprites.front_default,
    enemySpeed: statsOpponent[5].base_stat,
    enemyDefense: statsOpponent[2].base_stat,
    enemyAttack: statsOpponent[1].base_stat,
    enemyHp: statsOpponent[0].base_stat,
  });
});

const fetchPokemonData = async (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      });
  });
};

const getAbility = (abilities) => {
  for (let i = 0; i < abilities.length; i++) {
    if (abilities[i].is_hidden === false) return abilities[i].ability.name;
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
