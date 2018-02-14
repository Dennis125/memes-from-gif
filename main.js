//promise to call url ==================================================
const vanillaGet = url => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url);
		xhr.addEventListener('load', e => {
			const data = JSON.parse(e.currentTarget.response);
			resolve(data)
		})
		xhr.addEventListener('error', err => {
			reject(err);
		})
		xhr.send();
	});
}
// state for the memes//==================================================
const state = {
    searchMeme:'',
    validSearchMeme: false,
    errMessage: '',
    memes: [],
    setSearchMemes: (meme) => {
        if (meme === '' || meme.trim() === "") {
            state.validSearchMeme = false;
            state.errMessage = "search cannot be empty";
            return;
        }
        if (meme.length < 3) {
            state.validSearchMeme = false;
            state.errMessage = "Query must be at least three chars long";
            return;
        }
        state.validSearchMeme = true;
        state.errMessage = "";
        state.searchMeme = meme;
    },

    refreshMemes: (meme) => {
        if (state.validSearchMeme = false) {
            return;
        }
        const apiEndPoint = `http://api.giphy.com/v1/gifs/search?api_key=syP7w6LxYPKIJiQ8sP7lH5X7PsMqqAhC&q=${state.searchMeme}`
            const start = Date.now();
        return vanillaGet(apiEndPoint).then(data => {
            state.memes = [];
            for (let i = 0; i < data.data.length; i++) {
                const memeUrl = data.data[i].images.downsized_medium.url;

                state.memes.push(memeUrl)
            }
            return true;

        })
        .catch(e=>{
        });
    }
};


// ================================================================
//set variables for the search bars, buttons and container//
const docOne = document.querySelector.bind(document);
const inPuMemes = docOne('.js-input-memes');
const srchBtn = docOne('.js-search-btn');
const randBtn = docOne('.js-random-btn');
const funnyBtn = docOne('.js-funny-btn');
const catsBtn = docOne('.js-cats-btn');
const failBtn = docOne('.js-fails-btn');
const memesCon = docOne('.js-memesCont');
const hint = docOne('.js-hint');

// ================================================================
//render methode///
const render=()=>{
  if (state.isValidSearchQuery === false) {
		hint.innerHTML = state.errMessage;
		hint.style.color = 'red';
		hint.style.width = '100%';
		hint.style.display = 'block';
		return;
	}
  hint.innerHTML = '';
	memesCon.innerHTML = `<div id="loading"></div>`;
	srchBtn.setAttribute('disabled', 'disabled');
	inPuMemes.setAttribute('disabled', 'disabled');
    state.refreshMemes(inPuMemes.value).then(()=>{
     srchBtn.removeAttribute('disabled');
     inPuMemes.removeAttribute('disabled');
     inPuMemes.value = '';
     inPuMemes.setAttribute('placeholder', state.searchMeme);
     let str = '';
     for (let i = 0; i<state.memes.length; i++){
       str += `<img src=${state.memes[i]}>`
     }
     memesCon.innerHTML = str;
   })

}



// ================================================================
// event handlers
const udateStateAndRedraw = (callback) => {
    callback();
    render();
}

const onKeyPressed = e =>{
  if(e.keyCode === 13){
      state.setSearchMemes(e.target.value);
    udateStateAndRedraw(()=>{
      state.setSearchMemes(e.target.value);

    });
  }
}
inPuMemes.addEventListener('keypress', onKeyPressed);

// send the inpute value to state function object function setSearchMemes to
// validate and set the searchMeme to a string value.
// than go to through the render.
srchBtn.addEventListener('click', e => {
  const valu = inPuMemes.value;
udateStateAndRedraw(()=>{
    state.setSearchMemes(valu);
  });
});

randBtn.addEventListener('click', e => {
	udateStateAndRedraw(() => {
		state.setSearchMemes('random');
		state.refreshMemes();
	})
})

funnyBtn.addEventListener('click', e => {
	udateStateAndRedraw(() => {
		state.setSearchMemes('funny');
		state.refreshMemes();
	})
})

catsBtn.addEventListener('click', e => {
	udateStateAndRedraw(() => {
		state.setSearchMemes('cats');
		state.refreshMemes();
	})
})

failBtn.addEventListener('click', e => {
	udateStateAndRedraw(() => {
		state.setSearchMemes('fails');
		state.refreshMemes();
	})
})







//
