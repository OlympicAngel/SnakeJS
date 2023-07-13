class Block {
    static width = 10;
    static ration = 1;
    constructor(x, y, color = "lime") {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        //set color
        ctx.fillStyle = this.color;
        //draw block
        ctx.fillRect(this.x * Block.width,
            this.y * Block.width,
            Block.width,
            Block.width)
    }

    drawHead(ctx, direction) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * Block.width + direction[0] * Block.width * 0.8 / 2 + Block.width * 0.8 / 8,
            this.y * Block.width + direction[1] * Block.width * 0.8 / 2 + Block.width * 0.8 / 8,
            Block.width * 0.8,
            Block.width * 0.8)
    }

    drawApple(ctx) {

        ctx.fillStyle = "lightgreen";
        ctx.fillRect(this.x * Block.width + Block.width * 0.45,
            this.y * Block.width - Block.width * 0.1,
            Block.width * 0.3,
            Block.width * 0.3)

        ctx.fillStyle = this.color;
        //top
        ctx.fillRect(this.x * Block.width + Block.width * 0.05,
            this.y * Block.width + Block.width * 0.1,
            Block.width * 0.4,
            Block.width * 0.1)

        ctx.fillRect(this.x * Block.width + Block.width * 0.55,
            this.y * Block.width + Block.width * 0.1,
            Block.width * 0.4,
            Block.width * 0.1)


        //middle
        ctx.fillRect(this.x * Block.width,
            this.y * Block.width + Block.width * 0.2,
            Block.width,
            Block.width * 0.7)


        //bottom
        ctx.fillRect(this.x * Block.width + Block.width * 0.15,
            this.y * Block.width + Block.width * 0.9,
            Block.width * 0.3,
            Block.width * 0.1)

        ctx.fillRect(this.x * Block.width + Block.width * 0.55,
            this.y * Block.width + Block.width * 0.9,
            Block.width * 0.3,
            Block.width * 0.1)

    }
}

