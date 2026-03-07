import { useEffect, useRef } from "react";
import Matter from "matter-js";

export function FunPhysics() {

    const sceneRef = useRef(null);

    useEffect(() => {

        const {
            Engine,
            Render,
            Runner,
            World,
            Bodies,
            Mouse,
            MouseConstraint,
            Body,
            Events
        } = Matter;

        const engine = Engine.create();
        const world = engine.world;

        // smoother gravity
        engine.gravity.y = 0.7;

        const width = sceneRef.current.clientWidth;
        const height = sceneRef.current.clientHeight;

        const render = Render.create({
            element: sceneRef.current,
            engine,
            options: {
                width,
                height,
                wireframes: false,
                background: "transparent"
            }
        });

        /* ---------- boundaries ---------- */

        const ground = Bodies.rectangle(width / 2, height + 20, width, 40, {
            isStatic: true,
            render: { visible: false }
        });

        const leftWall = Bodies.rectangle(-20, height / 2, 40, height, {
            isStatic: true,
            render: { visible: false }
        });

        const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height, {
            isStatic: true,
            render: { visible: false }
        });

        /* ---------- object helper ---------- */

        function createBody(body) {
            Body.setAngle(body, Math.random() * Math.PI);
            return body;
        }

        /* ---------- objects ---------- */

        const reactLogo = createBody(
            Bodies.circle(width * 0.2, -100, 40, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/vendor/React-icon.png",
                        xScale: 0.15,
                        yScale: 0.15
                    }
                }
            })
        );

        const jsLogo = createBody(
            Bodies.rectangle(width * 0.4, -150, 80, 80, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/vendor/JavaScript-logo.png",
                        xScale: 0.2,
                        yScale: 0.2
                    }
                }
            })
        );

        const phpLogo = createBody(
            Bodies.rectangle(width * 0.6, -200, 100, 60, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/vendor/PHP-logo.png",
                        xScale: 0.25,
                        yScale: 0.25
                    }
                }
            })
        );

        const coffeeLogo = createBody(
            Bodies.circle(width * 0.5, -250, 45, {
                restitution: 0.9,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/Open-Doodles-Coffee.png",
                        xScale: 0.6,
                        yScale: 0.6
                    }
                }
            })
        );

        const laravelLogo = createBody(
            Bodies.rectangle(width * 0.8, -300, 120, 40, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/vendor/laravel-logolockup-rgb-red.png",
                        xScale: 0.2,
                        yScale: 0.2
                    }
                }
            })
        );

        const finalLogo = createBody(
            Bodies.circle(width * 0.3, -350, 50, {
                restitution: 0.85,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/logo.svg",
                        xScale: 0.1,
                        yScale: 0.1
                    }
                }
            })
        );

        const codingSvg = createBody(
            Bodies.circle(width * 0.7, -400, 45, {
                restitution: 0.85,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/coding.svg",
                        xScale: 0.09,
                        yScale: 0.09
                    }
                }
            })
        );

        const zakaLogo = createBody(
            Bodies.circle(width * 0.5, -450, 40, {
                restitution: 0.85,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/zaka.svg",
                        xScale: 0.2,
                        yScale: 0.2
                    }
                }
            })
        );

        const DoodleReflecting = createBody(
            Bodies.circle(width * 0.35, -500, 50, {
                restitution: 0.85,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/Open-Doodles-Reflecting.png",
                        xScale: 0.30,
                        yScale: 0.30
                    }
                }
            })
        );

        const DoodleStudying = createBody(
            Bodies.circle(width * 0.65, -550, 50, {
                restitution: 0.85,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    sprite: {
                        texture: "/logo/OpenDoodles-Studying.png",
                        xScale: 0.25,
                        yScale: 0.25
                    }
                }
            })
        );

        const helloWorldText = createBody(
            Bodies.rectangle(width * 0.2, -520, 220, 60, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    fillStyle: "#ffffff",
                    strokeStyle: "#000",
                    lineWidth: 2
                }
            })
        );

        const worksMachineText = createBody(
            Bodies.rectangle(width * 0.4, -560, 260, 60, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    fillStyle: "#facc15",
                    strokeStyle: "#000",
                    lineWidth: 2
                }
            })
        );

        const shipItText = createBody(
            Bodies.rectangle(width * 0.6, -600, 180, 60, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    fillStyle: "#111827",
                    strokeStyle: "#000",
                    lineWidth: 2
                }
            })
        );

        const fixProductionText = createBody(
            Bodies.rectangle(width * 0.75, -640, 240, 60, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    fillStyle: "#ffffff",
                    strokeStyle: "#000",
                    lineWidth: 2
                }
            })
        );

        const coffeeFirstText = createBody(
            Bodies.rectangle(width * 0.5, -680, 220, 60, {
                restitution: 0.8,
                friction: 0.3,
                frictionAir: 0.02,
                render: {
                    fillStyle: "#fde047",
                    strokeStyle: "#000",
                    lineWidth: 2
                }
            })
        );

        World.add(world, [
            ground,
            // ceiling,
            leftWall,
            rightWall,
            reactLogo,
            jsLogo,
            phpLogo,
            coffeeLogo,
            laravelLogo,
            finalLogo,
            codingSvg,
            zakaLogo,
            DoodleReflecting,
            DoodleStudying,
            helloWorldText,
            worksMachineText,
            shipItText,
            fixProductionText,
            coffeeFirstText
        ]);

        /* ---------- mouse drag ---------- */

        const mouse = Mouse.create(render.canvas);

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: {
                stiffness: 0.2
            }
        });

        World.add(world, mouseConstraint);

        /* ---------- click impulse (fun) ---------- */

        Events.on(mouseConstraint, "mousedown", function (event) {

            const mousePosition = event.mouse.position;

            world.bodies.forEach(body => {

                if (Matter.Bounds.contains(body.bounds, mousePosition)) {

                    Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * 0.05,
                        y: -0.05
                    });

                }

            });

        });

        /* ---------- run engine ---------- */

        Render.run(render);

        Events.on(render, "afterRender", function () {

            const ctx = render.context;

            function drawText(body, text, color = "#000") {

                const pos = body.position;

                ctx.save();
                ctx.translate(pos.x, pos.y);
                ctx.rotate(body.angle);

                ctx.fillStyle = color;
                ctx.font = "600 18px 'JetBrains Mono'";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(text, 0, 0);

                ctx.restore();
            }

            drawText(helloWorldText, "Hello World");
            drawText(worksMachineText, "Works on my machine");
            drawText(shipItText, "Ship It 🚀", "#fff");
            drawText(fixProductionText, "Fix in production");
            drawText(coffeeFirstText, "Coffee First ☕");

        });

        const runner = Runner.create();
        Runner.run(runner, engine);

        /* ---------- cleanup ---------- */

        return () => {
            Render.stop(render);
            Runner.stop(runner);
            World.clear(world);
            Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };

    }, []);

    return (
        <div
            ref={sceneRef}
            style={{ width: "100%", height: "100%" }}
        />
    );
}