<template>
	<section>
		<img src="" alt="" id="mirror" />
	</section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Vector2 } from "../interfaces/vector";
import { Color } from "../interfaces/color";

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
	colors: Color[];
	test: string;

	constructor() {
		super();

		// create canvas and give it an id
		this.canvas = document.createElement("canvas");
		this.canvas.id = "canvas";

		// setup defaults
		this.drawing = false;
		this.lineWidth = 5;
		this.lineCap = "round";
		this.lineJoin = "round";
		this.strokeStyle = "#000000";
		this.ctx = this.canvas.getContext("2d");
		this.mousePosition = { x: 0, y: 0 };

		this.test = null;

		// set up colors
		this.colors = [
			{ name: "Red", code: "#990000" },
			{ name: "Green", code: "#009900" },
			{ name: "Blue", code: "#000099" },
			{ name: "Black", code: "#000000" },
		];
	}

	mounted(): void {
		// attach canvas to window
		this.$el.appendChild(this.canvas);

		// setup context with canvas and stroke settings
		this.setupContext();

		// set up canvas event listeners
		this.setupCanvas();

		// create toolbar
		this.createToolbar();

		console.log("mounted");
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

	// set up context. done in a separate function so later on if we need to we can just call this function again instead of resetting the whole canvas
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

	// create toolbar
	createToolbar(): void {
		let toolbar = document.createElement("div");
		toolbar.classList.add("toolbar");

		// create the clear button
		let clearButton = document.createElement("button");
		clearButton.innerText = "Clear";
		clearButton.classList.add("clear");
		clearButton.addEventListener("click", this.clearCanvas);
		toolbar.appendChild(clearButton);

		this.colors.forEach((c) => {
			let colorButton = document.createElement("button");
			colorButton.innerText = c.name;
			colorButton.dataset.code = c.code;
			colorButton.addEventListener("click", this.setColor);
			toolbar.appendChild(colorButton);
		});

		// create save button
		let saveButton = document.createElement("button");
		saveButton.innerText = "Save";
		saveButton.classList.add("save");
		saveButton.addEventListener("click", this.saveCanvas);
		toolbar.appendChild(saveButton);

		this.$el.appendChild(toolbar);
	}

	// clears the canvas
	clearCanvas(): void {
		this.ctx.clearRect(
			0,
			0,
			this.canvas.offsetWidth,
			this.canvas.offsetHeight
		);
	}

	// select different color
	setColor(e): void {
		this.ctx.strokeStyle = e.target.dataset.code;
	}

	// save image
	saveCanvas(): void {
		// this will do for now. opens the image in a new window/tab
		// window.open(this.canvas.toDataURL());

		this.test = this.canvas.toDataURL();

		this.clearCanvas();

		let img = new Image();
		img.src = this.test;

		window.setTimeout(() => {
			console.log("running");

			this.ctx.drawImage(
				img,
				0,
				0,
				this.canvas.offsetWidth,
				this.canvas.offsetHeight
			);

			// this.$el.appendChild(img);
		}, 1000);
	}
}
</script>

<style>
</style>