<template>
  <div class="home">
    <SVGContainerNew :params="viewbox_params" />
    <SVGAddPath :viewbox_params="viewbox_params" />
  </div>
</template>

<script>
// import SVGContainer from "../components/svg/SVGContainer";
import SVGAddPath from "../components/svg/SVGAddPath";
import SVGContainerNew from "../components/svg/SVGContainerNew";

// const unit_circle_path = "M -1, 0 a 1, 1 0 1, 1 2, 0 a 1, 1 0 1, 1 -2, 0";
// const unit_square_path = "M -1 -1 H 1 V 1 H -1 Z";
// const known_paths = {
//   circle: unit_circle_path,
//   square: unit_square_path,
// };
//const identity_transform = "matrix(1,0,0,1,0,0)";

export default {
  name: "Home",
  components: {
    // SVGContainer,
    SVGAddPath,
    SVGContainerNew,
  },
  data() {
    return {
      viewbox_params: {
        x: 0,
        y: 0,
        width: 8,
        height: 8,
      },
    };
  },
  mounted() {},
  // data() {
  //   return {
  //     path_d: "",
  //     input_elements: [
  //       {
  //         id: 0,
  //         type: "circle",
  //         transform: false,
  //       },
  //       {
  //         id: 1,
  //         type: "square",
  //         transform: false,
  //       },
  //     ],
  //     elements: [],
  //   };
  // },
  // mounted() {
  //   this.elements = this.compileElements(this.input_elements);
  // },
  // methods: {
  //   compileElements(elements) {
  //     let compiled_elements = [];
  //     for (let i = 0; i < elements.length; i++) {
  //       const element = elements[i];
  //       const compiled_element = this.compileElement(element);
  //       compiled_elements.push(compiled_element);
  //     }
  //     console.log("compiled_elements", compiled_elements);
  //     return compiled_elements;
  //   },
  //   // adds the path d (if not defined) and gets bbox
  //   compileElement(element) {
  //     let compiled_element = JSON.parse(JSON.stringify(element));
  //     if (!"d" in compiled_element) {
  //       compiled_element.d = known_paths[compiled_element.type];
  //     }
  //     if (!"bbox" in compiled_element) {
  //       compiled_element.bbox = this.getBBox(compiled_element.d);
  //     }
  //     return compiled_element;
  //   },
  //   //addElement(type, transform = false) {},
  //   // hacky helper function - 'renders' a path element to get its bbox
  //   getBBox(d) {
  //     let hidden_path = document.createElementNS(
  //       "http://www.w3.org/2000/svg",
  //       "path"
  //     );
  //     hidden_path.setAttribute("d", d);
  //     const hidden_svg = document.getElementById("hidden_svg");
  //     hidden_svg.appendChild(hidden_path);
  //     const bbox = hidden_path.getBBox();
  //     hidden_svg.removeChild(hidden_path);
  //     return bbox;
  //   },
  // },
};
</script>
