<template>
	<section></section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Vector2 } from "../interfaces/vector";

@Component
export default class App extends Vue {
	canvas: HTMLCanvasElement;
	drawing: boolean;
	lineWidth: number;
	lineCap: CanvasLineCap;
	lineJoin: CanvasLineJoin;
	strokeStyle: string;
	ctx: CanvasRenderingContext2D;
	mousePosition: Vector2;

	constructor() {
		super();

		// create canvas and give it an id
		this.canvas = document.createElement("canvas");
		this.canvas.id = "canvas";
		this.drawing = false;
		this.lineWidth = 5;
		this.lineCap = "round";
		this.lineJoin = "round";
		this.strokeStyle = "#990000";
		this.ctx = this.canvas.getContext("2d");
		this.mousePosition = { x: 0, y: 0 };
	}

	mounted(): void {
		// attach canvas to window
		this.$el.appendChild(this.canvas);

		// setup context with canvas and stroke settings
		this.setupContext();

		// set up canvas event listeners
		this.setupCanvas();
	}

	setMousePosition({ x, y }: Vector2): void {
		this.mousePosition = { x, y };
	}

	// cursor position goes in, cursor position relative to the canvas comes out
	getRelativePosition({ x, y }: Vector2): Vector2 {
		const bounds = this.canvas.getBoundingClientRect();
		const outX = x - bounds.left;
		const outY = y - bounds.top;

		return { x: outX, y: outY };
	}

	// set up context. done in a separate function so later on when/if we change colors or sizes we can just call this function instead of redrawing the whole thing
	setupContext(): void {
		// set the context canvas to be the same size as the canvas element
		this.ctx.canvas.height = this.canvas.offsetHeight;
		this.ctx.canvas.width = this.canvas.offsetWidth;

		this.ctx.lineWidth = this.lineWidth;
		this.ctx.lineCap = this.lineCap;
		this.ctx.lineJoin = this.lineJoin;
		this.ctx.strokeStyle = this.strokeStyle;
	}

	// set up user input handling
	setupCanvas(): void {
		// start draw
		this.canvas.addEventListener("mousedown", this.startDrawing);

		// stop draw on mouse up or if the mouse leaves the canvas
		this.canvas.addEventListener("mouseup", this.stopDrawing);
		this.canvas.addEventListener("mouseleave", this.stopDrawing);

		// draw
		this.canvas.addEventListener("mousemove", this.draw);
	}

	// on click
	startDrawing(e): void {
		this.setMousePosition(
			this.getRelativePosition({ x: e.clientX, y: e.clientY })
		);

		this.ctx.moveTo(this.mousePosition.x, this.mousePosition.y);
		this.drawing = true;
	}

	// on drag
	draw(e): void {
		if (!this.drawing) {
			return;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(this.mousePosition.x, this.mousePosition.y);

		this.setMousePosition(
			this.getRelativePosition({ x: e.clientX, y: e.clientY })
		);

		this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);

		this.ctx.stroke();
	}

	// on release
	stopDrawing(): void {
		this.drawing = false;
	}
}
</script>

<style>
</style>