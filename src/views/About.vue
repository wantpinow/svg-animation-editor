<template>
  <div class="about">
    <h1>This is an about page</h1>
    <svg width="500" height="500" viewBox="0 0 20 20">
      <rect id="background" x="0" y="0" width="20" height="20" fill="gray" />
      <rect id="testrect" x="5" y="5" width="5" height="5" />
    </svg>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);
export default {
  mounted() {
    gsap.set("#testrect", { transformOrigin: "center center" });
    Draggable.create("#testrect", {
      type: "rotation",
      transformOrigin: "50% 50%",
      onDrag: this.logDrag,
    });
    // gsap.to("#testrect", {
    //   duration: 10,
    //   rotation: 360,
    //   transformOrigin: "50% 50%",
    // });
  },
  methods: {
    logDrag() {
      console.log(Draggable.get("#testrect"));
    },
  },
};
</script>
