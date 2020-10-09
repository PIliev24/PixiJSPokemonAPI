var pokemonData,
  selectedPokemon = {
    name: "",
    ability: "",
    backImageUrl: "",
    speed: "",
    specialDefense: "",
    specialAttack: "",
    defense: "",
    attack: "",
    hp: "",
    moveOne: "",
    moveTwo: "",
    moveThree: "",
    moveFour: "",
  };
const initialUrl = "https://pokeapi.co/api/v2/pokemon/";

const fetchPokemonData = async () => {
  return new Promise((resolve, reject) => {
    fetch(initialUrl)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      });
  });
};

const loadPokemonData = async (data) => {
  let _pokemonData = await Promise.all(
    data.map(async (pokemon) => {
      let pokemonRecord = await getPokemon(pokemon.url);
      return pokemonRecord;
    })
  );
  pokemonData = _pokemonData;
};

async function getPokemon(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      });
  });
}

const getAbility = (abilities) => {
  for (let i = 0; i < abilities.length; i++) {
    if (abilities[i].is_hidden === false) return abilities[i].ability.name;
  }
};

const createPokemonTable = () => {
  let container = document.getElementById("container"),
    pokeNumber = 1,
    textNode;

  pokemonData.forEach((pokemon) => {
    let imageUrl = pokemon.sprites["front_default"],
      ability = getAbility(pokemon.abilities),
      stats = pokemon.stats,
      moves = pokemon.moves,
      pokeInfoDivBox = document.createElement("pokeInfoDivBox"),
      pokeCard = document.createElement("div");
    pokeCard.className = "pokeCard";
    pokeCard.id = pokeNumber;

    let imageDiv = document.createElement("div"),
      imageTag = document.createElement("img");
    imageTag.src = imageUrl;
    imageTag.id = "pokemonImage";
    imageDiv.id = "imageDiv";
    imageDiv.appendChild(imageTag);
    pokeCard.appendChild(imageDiv);

    let nameLabel = document.createElement("h2");
    textNode = document.createTextNode(pokemon.name);
    nameLabel.appendChild(textNode);
    pokeInfoDivBox.appendChild(nameLabel);

    let abilityNode = document.createElement("label");
    textNode = document.createTextNode("Ability : " + ability);
    abilityNode.appendChild(textNode);
    pokeInfoDivBox.appendChild(abilityNode);

    for (let i = 0; i < 4; i++) {
      let moveLabel = document.createElement("label");
      textNode = document.createTextNode(
        "Move " + (i + 1) + " : " + moves[i].move.name
      );
      moveLabel.appendChild(textNode);
      pokeInfoDivBox.appendChild(moveLabel);
    }

    let speed = document.createElement("label");
    textNode = document.createTextNode("Speed : " + stats[5].base_stat);
    speed.appendChild(textNode);
    pokeInfoDivBox.appendChild(speed);

    let specialDefense = document.createElement("label");
    textNode = document.createTextNode(
      "Special Defense : " + stats[4].base_stat
    );
    specialDefense.appendChild(textNode);
    pokeInfoDivBox.appendChild(specialDefense);

    let specialAttack = document.createElement("label");
    textNode = document.createTextNode(
      "Special Attack : " + stats[3].base_stat
    );
    specialAttack.appendChild(textNode);
    pokeInfoDivBox.appendChild(specialAttack);

    let defense = document.createElement("label");
    textNode = document.createTextNode("Defense : " + stats[2].base_stat);
    defense.appendChild(textNode);
    pokeInfoDivBox.appendChild(defense);

    let attack = document.createElement("label");
    textNode = document.createTextNode("Attack : " + stats[1].base_stat);
    attack.appendChild(textNode);
    pokeInfoDivBox.appendChild(attack);

    let hp = document.createElement("label");
    textNode = document.createTextNode("HP : " + stats[0].base_stat);
    hp.appendChild(textNode);
    pokeInfoDivBox.appendChild(hp);

    pokeInfoDivBox.className = "pokeInfoDivBox";
    pokeCard.appendChild(pokeInfoDivBox);

    let startBattleButton = document.createElement("button");
    startBattleButton.className = "startBattleButton";
    textNode = document.createTextNode("Select pokemon for battle");
    startBattleButton.appendChild(textNode);
    pokeCard.appendChild(startBattleButton);
    startBattleButton.onclick = (e) => {
      goToBattleRoute(e.target.parentNode);
    };

    container.appendChild(pokeCard);
    pokeNumber++;
  });
};

const goToBattleRoute = (node) => {
  location.assign("/battle/" + node.id);
};

const loadBody = async () => {
  let response = await fetchPokemonData(initialUrl);
  await loadPokemonData(response.results);
  createPokemonTable();
};
