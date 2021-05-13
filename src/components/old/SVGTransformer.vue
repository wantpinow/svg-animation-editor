<template>
  <g v-if="transform">
    <rect />

    <circle :cx="bbPos('tl').x" :cy="bbPos('tl').y" r="0.5" />
    <circle :cx="bbPos('tr').x" :cy="bbPos('tr').y" r="0.5" />
    <circle :cx="bbPos('bl').x" :cy="bbPos('bl').y" r="0.5" />
    <circle :cx="bbPos('br').x" :cy="bbPos('br').y" r="0.5" />
  </g>
</template>

<script>
export default {
  props: ["bbox", "transform"],
  methods: {
    bbPos(corner) {
      // LOOK HERE FOR MORE http://tutorials.jenkov.com/svg/svg-transformation.html#matrix
      // HOMOGENOUS COORDS (X,Y,1)
      // we get a,b,c,d,e,f from the tranform to create:
      // [a,c,e]
      // [b,d,f]
      // [0,0,1]

      // we want the new point: M*p:
      // = [ax+cy+e, bx+dy+f, 1]
      let x = this.bbox.x;
      let y = this.bbox.y;

      if (corner == "tr") {
        x += this.bbox.width;
      } else if (corner == "bl") {
        y += this.bbox.height;
      } else if (corner == "br") {
        x += this.bbox.width;
        y += this.bbox.height;
      }

      // convert string to array
      let xform = this.transform;
      xform = xform.replace("matrix", "");
      xform = xform.replace("(", "[");
      xform = xform.replace(")", "]");
      xform = JSON.parse(xform);

      const new_x = xform[0] * x + xform[2] * y + xform[4];
      const new_y = xform[1] * x + xform[3] * y + xform[5];
      return { x: new_x, y: new_y };
    },
  },
};
</script>

<style scoped>
</style>