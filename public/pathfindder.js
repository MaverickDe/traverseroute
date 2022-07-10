const canvas = document.querySelector("canvas");

let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 200;
let timeout = {};

if (canvas.width > 2000) {
  canvas.width = 2000;
}
if (canvas.height > 1500) {
  canvas.height = 1000 - 200;
}

class Box {
  constructor(box) {
    if (box) {
      this.x = box.x;
      this.y = box.y;
      this._height = box._height;
      this._width = box._width;
      this.type = box.type;
    }
  }

  setvalue(box) {
    this._height = box._height;
    this._width = box._width;
    this.type = box.type;
  }

  update() {
    if (this.type == "pathway") {
      ctx.fillStyle = "white";
      ctx.fillRect(this._width, this._height, boxwidth, boxheight);
      ctx.fill();
    }
    if (this.type == "pathway") {
      ctx.strokeStyle = "white";
      ctx.fillRect(this._width, this._height, boxwidth, boxheight);
      ctx.stroke();
    }
  }
  draw() {
    let _width = w * boxwidth;
    let _height = h * boxheight;

    if (
      _width > delaywidth &&
      _width < canvas.width - delaywidth &&
      _height > delayheight &&
      _height < canvas.height - delayheight
    ) {
      this.passed = true;
      let _g = random.find((e) => {
        if (e >= _width && e <= _width + boxwidth) {
          // console.log(e._width)
          return true;
        }
        return false;
      });

      if (_g) {
        ctx.fillStyle = "white";
        ctx.fillRect(_width, _height, boxwidth, boxheight);
        ctx.fill();
        if (w == 3 && !beginpath) {
          //   console.log("Fff");
          beginpath = { type: "beginpath", _width, _height, color: "red" };
          ctx.fillStyle = "red";
          ctx.fillRect(_width, _height, boxwidth, boxheight);
          ctx.fill();
        }
        // console.log(w);
        if (w > 3 && h > 3 && !endpath) {
          //   console.log("Fff");
          endpath = { type: "endpath", _width, _height, color: "purple" };
          ctx.fillStyle = "purple";
          ctx.fillRect(_width, _height, boxwidth, boxheight);
          ctx.fill();
        }

        //   arrayOfBox.push({ type: "pathway", _width, _height });
        this.setvalue({ type: "pathway", _width, _height });
      } else {
        // ctx.strokeRect(_width, _height, boxwidth, boxheight);

        //   arrayOfBox.push({ type: "obstacle", _width, _height });
        this.setvalue({ type: "obstacle", _width, _height });
      }
      //   console.log(_g, random, _width, _width + boxwidth);
    }
  }
}

let boxwidth = 20;
let boxheight = 20;
let delayheight = 30;
let delaywidth = 30;

let noOfHorinzontalbox = ((canvas.width - delaywidth) / boxwidth).toFixed(0);
let noOfVerticalbox = ((canvas.height - delayheight) / boxheight).toFixed(0);

// console.log(noOfHorinzontalbox, noOfVerticalbox);
let HandV = noOfHorinzontalbox * noOfVerticalbox;
// let HandV = 200;
// console.log(canvas.width);
let arrayOfBox = [];
let random = [];

let beginpath;
let endpath;

function draw() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  for (h = 0; h < noOfVerticalbox; h++) {
    random = [];

    for (w = 0; w < noOfHorinzontalbox; w++) {
      let g = (Math.random() * canvas.width).toFixed(0);
      random.push(+g);
    }

    for (w = 0; w < noOfHorinzontalbox; w++) {
      let box = new Box();
      box.draw();
      if (box.passed) {
        arrayOfBox.push(box);
      }
    }
  }

  ctx.fill();
}

draw();

let click;

const reset_ = document.querySelector(".reset");

console.log(reset_);
let time_ = { 1: [0], 2: [0] };
reset_.addEventListener("click", (e) => {
  reset(e, 1);
});

reset_.ontouchstart = (e) => {
  reset(e, 2);
};

let startimm = false;
const startt = document.querySelector(".startt");
const startonchange = document.querySelector(".startonchange");
startt.addEventListener("click", (e) => {
  if (!startimm) {
    for (val in timeout) {
      clearTimeout(timeout[val]);
    }
    timeout = {};
    _findpath_([new pathss({ ...beginpath, frame: "start" }).list()]);
    _findpath_([new pathss({ ...endpath, frame: "end" }).list()]);
  }
});
startonchange.addEventListener("click", (e) => {
  startimm = !startimm;
  e.currentTarget.classList.toggle("active");
});

function reset(e, a) {
  for (val in timeout) {
    clearTimeout(timeout[val]);
  }
  timeout = {};
  document.querySelector(".distance").innerText = "";
  document.querySelector(".err").innerText = "";
  animationframes = {};
  stopp = false;
  painted = [];
  poinofview = undefined;
  arrayOfBox.forEach((e) => {
    e.update();
  });
  ctx.fillStyle = endpath.color;
  ctx.fillRect(endpath._width, endpath._height, boxwidth, boxheight);
  ctx.fill();

  ctx.fillStyle = beginpath.color;
  ctx.fillRect(beginpath._width, beginpath._height, boxwidth, boxheight);
  ctx.fill();

  let time = e.timeStamp - time_[a];
  if (time <= 300) {
    resetmaze();
  }
  time_[a] = e.timeStamp;
}

function resetmaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  arrayOfBox = [];
  beginpath = undefined;
  endpath = undefined;
  draw();
  console.log(beginpath);
}

function touchstartt(e) {
  // console.log(endpath)

  let x =
    e.offsetX ||
    e.changedTouches[0].clientX - e.currentTarget.getBoundingClientRect().x;
  let y =
    e.offsetY ||
    e.changedTouches[0].clientY - e.currentTarget.getBoundingClientRect().y;
  if (
    x > beginpath._width &&
    x < beginpath._width + boxwidth &&
    y > beginpath._height &&
    y < beginpath._height + boxheight
  ) {
    // console.log("arrrrrrayyyyy boxxxxxxxxxxx");
    click = beginpath;
  }
  if (
    x > endpath._width &&
    x < endpath._width + boxwidth &&
    y > endpath._height &&
    y < endpath._height + boxheight
  ) {
    click = endpath;
  }
}

function touchemove(e) {
  // console.log(e.clientY-e.currentTarget.getBoundingClientRect().y,e.offsetY,"yy",e.currentTarget.getBoundingClientRect().y);
  // console.log(e.clientX-e.currentTarget.getBoundingClientRect().x,e.offsetX,"xx",e.currentTarget.getBoundingClientRect().x);
  // console.log( e.changedTouches[0].clientX - e.currentTarget.getBoundingClientRect().x,"XXXXX")
  // console.log(  e.changedTouches[0].clientY- e.currentTarget.getBoundingClientRect().y,"YYYY")
  if (click) {
    // console.log(e)
    // click.moved=true
    let vv = { ...click };
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    arrayOfBox.forEach((e) => {
      e.update();
    });
    click._width =
      e.offsetX ||
      (e.changedTouches &&
        e.changedTouches[0].clientX -
          e.currentTarget.getBoundingClientRect().x);
    click._height =
      e.offsetY ||
      (e.changedTouches &&
        e.changedTouches[0].clientY -
          e.currentTarget.getBoundingClientRect().y);
    // console.log(click);
    // console.log(click._height, delayheight)
    if (!click._width || !click._height) {
      click = vv;
      // return
    }
    if (click._height <= delayheight) {
      click._height = arrayOfBox[0]._height;
    }
    if (click._width <= arrayOfBox[0]._width) {
      click._width = arrayOfBox[0]._width;
    }
    if (click._width >= canvas.width - delaywidth) {
      click._width = arrayOfBox[arrayOfBox.length - 1]._width;
    }
    if (click._height >= canvas.height - delayheight) {
      click._height = arrayOfBox[arrayOfBox.length - 1]._height;
    }

    let _g = arrayOfBox.find((e) => {
      if (
        e._width <= +click._width &&
        e._width + boxwidth >= click._width &&
        e._height <= +click._height &&
        e._height + boxheight >= click._height
      ) {
        // console.log(e._width)
        return true;
      }
      return false;
    });

    // click.heigth=-g.height
    // click.width = -g.width
    //  console.log(_g,"jjjjjjjjjjjjjjj")

    if (click.type == "beginpath") {
      beginpath = {
        ...click,

        _width: _g._width,
        _height: _g._height,
      };
      ctx.fillStyle = endpath.color;
      ctx.fillRect(endpath._width, endpath._height, boxwidth, boxheight);
      ctx.fill();
    }
    if (click.type == "endpath") {
      endpath = {
        ...click,

        _width: _g._width,
        _height: _g._height,
      };
      ctx.fillStyle = beginpath.color;
      ctx.fillRect(beginpath._width, beginpath._height, boxwidth, boxheight);
      ctx.fill();
    }
    // console.log(click);

    ctx.fillStyle = click.color;
    ctx.fillRect(_g._width, _g._height, boxwidth, boxheight);
    ctx.fill();
  }
}

function toucheend(e) {
  if (click) {
    if (
      (click._width == beginpath._width &&
        click._height == beginpath._height) ||
      (click._width == endpath._width && click._height == endpath._height)
    ) {
      return;
    }
    // console.log(click.moved);
    // _findpath_2([{ ...endpath, arr: { 11: [] } }]);
    animationframes = {};
    stopp = false;
    painted = [];
    poinofview = undefined;
    document.querySelector(".distance").innerText = "";
    document.querySelector(".err").innerText = "";
    // _findpath_([{ ...beginpath, arr: { 11: [] } }]);

    if (startimm) {
      for (val in timeout) {
        clearTimeout(timeout[val]);
      }
      timeout = {};

      _findpath_([new pathss({ ...beginpath, frame: "start" }).list()]);
      _findpath_([new pathss({ ...endpath, frame: "end" }).list()]);
    }
    // // start();
  }
  click = undefined;
}

canvas.ontouchstart = (e) => {
  touchstartt(e);
};
canvas.onmousedown = (e) => {
  //   console.log(e, beginpath, endpath);
  touchstartt(e);
};
canvas.onmousemove = (e) => {
  touchemove(e);
  //   console.log(e.offsetX, e.offsetY);
};
canvas.ontouchmove = (e) => {
  // console.log("Dddddddddddddddd")
  touchemove(e);
  //   console.log(e.offsetX, e.offsetY);
};
canvas.ontouchend = (e) => {
  toucheend(e);
  //   console.log(e.offsetX, e.offsetY);
};
canvas.onmouseup = (e) => {
  toucheend(e);
};

let stopp;

// let _beginpath = { beginpath };

function find(height, width) {
  return arrayOfBox.find((e) => {
    if (
      e._width == width &&
      //   e._width + boxwidth >= beginpath.beginpath._width &&
      e._height == height &&
      !e.type != "obstacle"
      //   e._height + boxheight >= beginpath.beginpath._height
    ) {
      // console.log(e._width)
      return true;
    }
    return false;
  });
}

let ffff = beginpath;
let bmw = [];
let frame;

let count = 0;

let poinofview;
let painted = [];

let animationframes = {};

class pathss {
  constructor(array) {
    this.arrr = {};

    this.gstart = [];
    this.count = 0;
    this._width = array._width;
    this._height = array._height;
    this.frame = array.frame;
    this.animation, (this.paths = {});
    this.paint = [];
    this.runningfun = {};

    animationframes[this.frame] = this;
  }

  list() {
    return {
      _width: this._width,
      _height: this._height,
      frame: this.frame,

      arr: { 11: [] },
    };
  }
}

function _findpath_(_beginpath) {
  if (stopp) {
    // console.log("stoppppp")
    return;
  }

  //   count++;
  let list__ = [];
  let arrlist = {};
  let deletevalue = [];
  let frame;

  _beginpath.forEach((e) => {
    if (!frame && e.frame) {
      frame = e.frame;
    }

    let { arrr, animationframe, path, gstart } = animationframes[frame];
    let id = Math.random();

    let beginpath = e;
    let arr = { _width: beginpath._width, _height: beginpath._height };

    let _arrvalue = Object.keys(beginpath.arr)[0];

    deletevalue.push(_arrvalue);
    // console.log(_arrvalue,animationframes[frame].arrr,"animationframes[frame].arrr")
    let _arrlast = animationframes[frame].arrr[_arrvalue];
    // let _arrlast = Object.values(animationframes[frame].arrr[_arrvalue])[0];
    if (!_arrlast || _arrlast == "") {
      _arrlast = [];
    }

    let updatedarr = {};
    updatedarr[id] = [..._arrlast, arr];

    let _g = arrayOfBox.find((e) => {
      if (
        e._width == beginpath._width &&
        //   e._width + boxwidth >= beginpath.beginpath._width &&
        e._height == beginpath._height
        //   e._height + boxheight >= beginpath.beginpath._height
      ) {
        // console.log(e._width)
        return true;
      }
      return false;
    });

    let list = [
      {
        ...beginpath,
        _width: beginpath._width + boxwidth,
      },
      {
        ...beginpath,
        _height: beginpath._height + boxheight,
      },
      {
        ...beginpath,
        _height: beginpath._height - boxheight,
      },

      {
        ...beginpath,
        _width: beginpath._width - boxwidth,
      },
    ];

    if (!_g) {
      return;
    }

    ctx.fillStyle = "red";

    if (stopp) {
      return;
    }
    // let kkkk;
    if (_g.type == "obstacle") {
      return;
    }

    let list1 = [];

    let gpainted = painted.find((e) => {
      if (e._width == beginpath._width && e._height == beginpath._height) {
        // console.log(e._width)
        return true;
      }
      return false;
    });
    if (!gpainted) {
      if (beginpath.initialpath) {
        ctx.fillStyle = "green";
        ctx.fillRect(_g._width, _g._height, boxwidth, boxheight);
        ctx.fill();
      }

      painted.push({
        _width: beginpath._width,
        _height: beginpath._height,
      });
    }

    let g = beginpath.initialpath;

    list.forEach((e, index) => {
      let listlock = false;

      let pain = animationframes[frame].paint.find((ee) => {
        if (ee._width == e._width && ee._height == e._height) {
          return true;
        }
        return false;
      });

      if (pain) {
        list[index] = null;
      }
      animationframes[frame].paint.forEach((ee) => {
        if (ee._width == e._width && ee._height == e._height && !listlock) {
          list[index] = null;

          listlock = true;
        }
      });

      let m = {};
      for (values in animationframes) {
        if (values != frame) {
          let arval = Object.values(animationframes[values].arrr);
          // console.log(arval)
          let res;
          let mm = arval.find((eee) => {
            res = eee.find((ee, index) => {
              if (ee._width == e._width && ee._height == e._height) {
                console.log(index);
                return true;
              }
              return false;
            });

            if (res) {
              return true;
            }
            return false;
          });

          if (mm) {
            // console.log(mm,mm.indexOf(res), mm.length,"mmmmmmmmmmmmmmmmmmmmm")
            mm.splice(mm.indexOf(res));
            m[values] = mm;

            let arr = [
              ...updatedarr[id],
              {
                _height: e._height,
                _width: e._width,
              },
            ];
            m[frame] = arr;
            poinofview = m;
            //  console.log("ooooooooooooooooooooooo");
            stopp = true;
            // poinofview = gs;
            bbtimeout();
          }
          // console.log(values);
        }
      }
    });

    // console.log(list,"list")
    list.forEach((e) => {
      if (e != null) {
        animationframes[frame].paint.push({
          _width: e._width,
          _height: e._height,
        });

        list1.push(e);
      }
    });

    list = list1;
    list1 = [];

    function _find(a) {
      return beginpath.arr[_arrvalue].find((e) => {
        if (e._width == a._width && e._height == a._height) {
          return true;
        }
        return false;
      });
    }

    if (!list || list == "") {
      // console.log("empty list")
      return;
    }

    let paint = animationframes[frame].paint.find((e) => {
      if (e._width == beginpath._width && e._height == beginpath._height) {
        // console.log(e._width)
        return true;
      }
      return false;
    });
    if (!paint) {
      animationframes[frame].paint.push({
        _width: beginpath._width,
        _height: beginpath._height,
      });
    }
    // console.log(_g)

    list.forEach((list) => {
      list.initialpath = {
        _width: beginpath._width,
        _height: beginpath._height,
      };
      list.arr = {};
      list.arr = updatedarr;
      arrlist[id] = updatedarr[id];

      list__.push(list);
    });

    if (stopp) {
      console.log("stoppppp");
      return;
    }
  });

  //     return
  // }

  if (list__ == "") {
    stopp = true;

    cancelAnimationFrame(animationframes[frame].animation);
    bbtimeout();

    return;
  }

  if (stopp) {
    console.log("noo");
    cancelAnimationFrame(animationframes[frame].animation);
    return;
  }

  for (value in arrlist) {
    animationframes[frame].arrr[value] = arrlist[value];
  }

  deletevalue.forEach((e) => {
    delete animationframes[frame].arrr[e];
  });

  animationframes[frame].animation = requestAnimationFrame(() => {
    _findpath_(list__);
  });
}

let ttimeout;

let bbtimeout = () => {
  if (!poinofview) {
    document.querySelector(".err").innerText =
      "this two path has no linkable route";
  }

  // console.log(poinofview, "pontofview");
  if (poinofview) {
    let m = {};

    // console.log(m)

    let myli = [];

    let end = poinofview["end"];
    end.splice(0, 1);
    end.reverse();
    let start = poinofview["start"];
    start.splice(0, 1);

    myli.push(...start);
    myli.push(...end);

    // console.log(m);

    drw(myli);
  }
};

function drw(aa) {
  let distance = document.querySelector(".distance");
  distance.innerText = `${aa.length} KM`;
  // clearInterval(bbtimeout);
  // let intervl

  aa.forEach((e, index) => {
    timeout[index] = setTimeout(() => {
      ctx.fillStyle = "cyan";
      ctx.fillRect(e._width, e._height, boxwidth, boxheight);
      ctx.fill();
    }, 100 * index);
  });
}
let arrr2 = [];
let animationframe2;

console.log(
  arrayOfBox.filter((e) => e.type == "pathway"),
  "number of pathway"
);
