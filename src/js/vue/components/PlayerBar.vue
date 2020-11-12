<template>
	<div>
		<h1>Players</h1>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { Player } from "../../interfaces/player";

@Component
export default class PlayerBar extends Vue {
	@Prop({}) players: Player[];

	constructor() {
		super();
	}

	get getPlayers(): Player[] {
		return this.players;
	}
}
</script>

<style>
</style>