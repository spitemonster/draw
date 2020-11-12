<template>
	<section>
		<draw-canvas v-if="playerValid"></draw-canvas>
		<player-creation v-else></player-creation>
		<player-bar></player-bar>
	</section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
// import { Vector2 } from "../interfaces/vector";
// import { Color } from "../interfaces/color";
import { Player } from "../interfaces/player";

import Bus from "../Bus.ts";

import DrawCanvas from "./components/DrawCanvas.vue";
import PlayerCreation from "./components/PlayerCreation.vue";
import PlayerBar from "./components/PlayerBar.vue";

@Component({
	components: {
		DrawCanvas,
		PlayerCreation,
		PlayerBar,
	},
})
export default class App extends Vue {
	constructor() {
		super();
	}

	get playerValid(): boolean {
		return false;
	}

	generateRoomCode(): string {
		return [...Array(4)]
			.map((i) => (~~(Math.random() * 36)).toString(36))
			.join("");
	}

	mounted(): void {
		Bus.$on("createPlayer", (playerData: Player) => {
			if (playerData.roomCode == "") {
				playerData.roomCode = this.generateRoomCode();
			}

			fetch("/players", {
				method: "POST",
				headers: {
					// gotta add this or bodyparser won't read the json data
					"Content-Type": "application/json",
				},
				body: JSON.stringify(playerData),
			}).then((res) => {
				console.log(res);
			});
		});
	}
}
</script>

<style>
</style>