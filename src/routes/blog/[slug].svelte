<script context="module">
	import posts from './_posts.js';
	
	export async function preload({ params }) {
		const data = posts.find(p => p.slug === params.slug)
		return { post: data }
	}
</script>

<script>
	import { onMount } from 'svelte'
	export let post;
	export let question = post.generate()

	onMount(() => {
		var canvas = document.getElementById("sig-canvas");
		var ctx = canvas.getContext("2d");
		ctx.strokeStyle = "#222222";
		ctx.lineWith = 2;

		var drawing = false;
		var mousePos = { x:0, y:0 };
		var lastPos = mousePos;
		canvas.addEventListener("mousedown", function (e) {
						drawing = true;
			lastPos = getMousePos(canvas, e);
		}, false);
		canvas.addEventListener("mouseup", function (e) {
			drawing = false;
		}, false);
		canvas.addEventListener("mousemove", function (e) {
			mousePos = getMousePos(canvas, e);
		}, false);

		// Get the position of the mouse relative to the canvas
		function getMousePos(canvasDom, mouseEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: mouseEvent.clientX - rect.left,
				y: mouseEvent.clientY - rect.top
			};
		}

		window.requestAnimFrame = (function (callback) {
			return window.requestAnimationFrame || 
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimaitonFrame ||
					function (callback) {
			window.setTimeout(callback, 1000/60);
					};
		})();

		// Draw to the canvas
		function renderCanvas() {
			if (drawing) {
				ctx.moveTo(lastPos.x, lastPos.y);
				ctx.lineTo(mousePos.x, mousePos.y);
				ctx.stroke();
				lastPos = mousePos;
			}
		}

		// Allow for animation
		(function drawLoop () {
			requestAnimFrame(drawLoop);
			renderCanvas();
		})();

		// Set up touch events for mobile, etc
		canvas.addEventListener("touchstart", function (e) {
						mousePos = getTouchPos(canvas, e);
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousedown", {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			canvas.dispatchEvent(mouseEvent);
		}, false);
		canvas.addEventListener("touchend", function (e) {
			var mouseEvent = new MouseEvent("mouseup", {});
			canvas.dispatchEvent(mouseEvent);
		}, false);
		canvas.addEventListener("touchmove", function (e) {
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousemove", {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			canvas.dispatchEvent(mouseEvent);
		}, false);

		// Get the position of a touch relative to the canvas
		function getTouchPos(canvasDom, touchEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top
			};
		}

		// Prevent scrolling when touching the canvas
		document.body.addEventListener("touchstart", function (e) {
			if (e.target == canvas) {
				e.preventDefault();
			}
		}, false);
		document.body.addEventListener("touchend", function (e) {
			if (e.target == canvas) {
				e.preventDefault();
			}
		}, false);
		document.body.addEventListener("touchmove", function (e) {
			if (e.target == canvas) {
				e.preventDefault();
			}
		}, false);
	})

	function onResponse(event) {
		question = {
			...question,
			answered: false,
			correct: false,
		};
	}
	function onCheckAnswer(event) {
		if (!question.response || question.response.length === 0) {
			return
		}
		question = {
			...question,
			answered: true,
			correct: parseInt(question.answer.toString(), 10) === parseInt(question.response.toString(), 10),
		};
	}
</script>

<style>
	/*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
	.content :global(h2) {
		font-size: 1.4em;
		font-weight: 500;
	}

	.content :global(pre) {
		background-color: #f9f9f9;
		box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
		padding: 0.5em;
		border-radius: 2px;
		overflow-x: auto;
	}

	.content :global(pre) :global(code) {
		background-color: transparent;
		padding: 0;
	}

	.content :global(ul) {
		line-height: 1.5;
	}

	.content :global(li) {
		margin: 0 0 0.5em 0;
	}

	canvas {
		border: 1px solid black;
		width: 100%;
		height: 100%;
	}

	.input {
		width: 40%;
	}

	.problem {
		display: flex;
		width: 100%;
	}

	.whiteboard {
		width: 60%;
		height: 70vh;
	}
</style>

<svelte:head>
	<title>{post.title}</title>
</svelte:head>

<h1>{post.title}</h1>

<div class="content">
	{@html post.html}
</div>

<p>
	{@html question.prompt}
</p>

<div class="problem">
	<div class="input">
		<input
			type="text"
			bind:value={question.response}
			on:input={event => onResponse(event)}>
		<button
			type="button"
			on:click={event => onCheckAnswer(event)}>Check</button>
		{#if question.correct && question.answered}
			<span style="color: green;">&#10004;</span>
		{:else if !question.correct && question.answered}
			<span style="color: red;">&#10008;</span>
		{/if}
	</div>

	<div class="whiteboard">
		<canvas id="sig-canvas">
			Get a better browser, bro.
		</canvas>
	</div>
</div>
