<template>
	<div>
		<label>
			Player Name
			<input type="text" v-model="player.playerName" />
		</label>

		<label>
			Room Code (Leave blank to create a new room)
			<input type="text" v-model="player.roomCode" />
		</label>

		<button @click="createPlayer">Test</button>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import Bus from "../../Bus.ts";

import { Player } from "../../interfaces/player";

@Component
export default class PlayerCreation extends Vue {
	player: Player;
	constructor() {
		super();

		this.player = {
			playerId: this.generateRandomString(),
			playerName: "",
			playerScore: 0,
			roomCode: "",
		};
	}

	generateRandomString(): string {
		return [...Array(10)]
			.map((i) => (~~(Math.random() * 36)).toString(36))
			.join("");
	}

	// validate and then submit new player data
	createPlayer(): void {
		if (this.validatePlayer()) {
			Bus.$emit("createPlayer", this.player);
		}
	}

	// confirm that the player info is valid
	validatePlayer(): boolean {
		return this.player.playerName != "" && this.player.playerId != "";
	}
}
</script>

<style>
</style>