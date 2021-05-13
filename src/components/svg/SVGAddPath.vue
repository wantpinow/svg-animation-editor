<template>
  <div>
    <form @submit="addPath">
      <h1 class="subtitle is-3">Add New Path</h1>
      <div class="block">
        <b-radio v-model="path_type" name="name" native-value="circle">
          Circle
        </b-radio>
        <b-radio v-model="path_type" name="name" native-value="square">
          Square
        </b-radio>
        <b-radio v-model="path_type" name="name" native-value="path">
          Custom
        </b-radio>
      </div>
      <b-input
        v-show="path_type == 'path'"
        v-model="custom_path"
        class="mt-4"
        placeholder="Custom path..."
      ></b-input>
      <hr />
      <b-button tag="input" native-type="submit" value="Add Path" />
    </form>
    <svg width="0" height="0" id="hidden_svg"></svg>
  </div>
</template>

<script>
const unit_circle_path = "M -1, 0 a 1, 1 0 1, 1 2, 0 a 1, 1 0 1, 1 -2, 0";
const unit_square_path = "M -1 -1 H 1 V 1 H -1 Z";

//const identity_transform = "matrix(1,0,0,1,0,0)";

export default {
  props: ["viewbox_params"],
  data() {
    return {
      path_type: "circle",
      custom_path: "",
    };
  },
  methods: {
    addPath(event) {
      event.preventDefault();
      let d = "";
      if (this.path_type == "circle") {
        d = unit_circle_path;
      } else if (this.path_type == "square") {
        d = unit_square_path;
      } else {
        d = this.custom_path;
      }
      if (d == "") {
        this.$buefy.snackbar.open({
          message: "Empty Path.",
          type: "is-danger",
        });
        return;
      }
      const bbox_rect = this.getBBox(d);
      const bbox = {
        x: bbox_rect.x,
        y: bbox_rect.y,
        width: bbox_rect.width,
        height: bbox_rect.height,
      };
      const id = this.makeid(30);
      const transform = this.getTransform(bbox);
      const element = {
        id: id,
        d: d,
        bbox: bbox,
        transform: transform,
        type: this.path_type,
      };
      this.$store.dispatch("svgElementAdd", element);
      console.log(
        JSON.parse(JSON.stringify(this.$store.getters.svgElementAll))
      );
      this.$buefy.snackbar.open({
        message: "Path Added!",
        type: "is-success",
      });
      this.custom_path = "";
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
    getTransform(bbox) {
      // LOOK HERE FOR MORE http://tutorials.jenkov.com/svg/svg-transformation.html#matrix
      // HOMOGENOUS COORDS (X,Y,1)
      // we get a,b,c,d,e,f from the tranform to create:
      // [a,c,e]
      // [b,d,f]
      // [0,0,1]

      // Step 1: translate to centered at (0,0)
      //      [1, 0, t1x]
      // T1 = [0, 1, t1y]
      //      [0, 0, 1  ]

      // Step 2: resize to correct size
      //      [sx,  0, 0]
      // T2 = [0 , sy, 0]
      //      [0 ,  0, 1]

      // Step 3: translate to centered at middle of viewbox
      //      [1, 0, t2x]
      // T3 = [0, 1, t2y]
      //      [0, 0, 1  ]

      // Compose T1, T2, T3. We do this in reverse to get:
      //                    [sx,  0, t1x*sx + t2x]
      // T = T3 * T2 * T1 = [ 0, sy, t1y*sy + t2y]
      //                    [ 0,  0,            1]

      // this makes everything 25% x 25% (1,1 aspect ratio)
      const desired_width = this.viewbox_params.width * 0.25;
      const desired_height = this.viewbox_params.height * 0.25;

      // get variables
      const t1x = -bbox.x - bbox.width / 2;
      const t1y = -bbox.y - bbox.height / 2;

      const sx = desired_width / bbox.width;
      const sy = desired_height / bbox.height;

      const t2x = this.viewbox_params.x + this.viewbox_params.width / 2;
      const t2y = this.viewbox_params.y + this.viewbox_params.height / 2;

      // return final matrix
      return (
        "matrix(" +
        sx +
        ",0,0," +
        sy +
        "," +
        (t1x * sx + t2x) +
        "," +
        (t1y * sy + t2y) +
        ")"
      );
    },
    // get random id
    makeid(length) {
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  },
};
</script>

<style scoped>
</style>