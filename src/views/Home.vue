<template>
  <div class="home">
    <SVGContainer :paths="test_paths" />

    <hr />
    <input v-model="path_d" type="text" placeholder="Define Path" />
    <button @click="add_path">Add Path</button>
    <br />
    <button @click="make_circle">Circle</button>
    <button @click="make_square">Square</button>

    <svg width="0" height="0" id="hidden_svg"></svg>
  </div>
</template>

<script>
import SVGContainer from "../components/svg/SVGContainer";

const unit_circle_path = "M -1, 0 a 1, 1 0 1, 1 2, 0 a 1, 1 0 1, 1 -2, 0";
const unit_square_path = "M -1 -1 H 1 V 1 H -1 Z";
//const identity_transform = "matrix(1,0,0,1,5,5)";

export default {
  name: "Home",
  components: {
    SVGContainer,
  },
  data() {
    return {
      path_d: "",
      test_paths: [],
    };
  },
  methods: {
    add_path() {
      if (this.path_d != "") {
        this.test_paths.push({
          id: this.test_paths.length,
          d: this.path_d,
          transform: false,
          bbox: this.getBBox(this.path_d),
        });
        this.path_d = "";
      }
    },
    make_circle() {
      this.path_d = unit_circle_path;
    },
    make_square() {
      this.path_d = unit_square_path;
    },
    // hacky helper function - 'renders' a path element to get its bbox
    getBBox(d) {
      let hidden_path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      hidden_path.setAttribute("d", d);
      const hidden_svg = document.getElementById("hidden_svg");
      hidden_svg.appendChild(hidden_path);
      const bbox = hidden_path.getBBox();
      hidden_svg.removeChild(hidden_path);
      return bbox;
    },
  },
};
</script>
