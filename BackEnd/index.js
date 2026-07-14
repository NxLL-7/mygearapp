require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const BC = require('bcrypt')
const saltRounds = 10
const pool = require('./PG_config.js')
const JWT = require('jsonwebtoken')
const PORT = process.env.PORT


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://mygearapp.netlify.app"
    ],
    credentials: true
}));
app.use(express.json())


app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.post("/user-register", async (req, res) => {
    try {
        const { full_Name, user_mobile, username, password } = req.body;
        if (!full_Name || !user_mobile || !username || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await pool.query(
            "SELECT user_id FROM users WHERE username = $1",
            [username]
        );
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists."
            });
        }

        const hashedPassword = await BC.hash(password, saltRounds);

        await pool.query(
            `INSERT INTO users
            (full_name, user_mobile, username, password)
            VALUES ($1, $2, $3, $4)`,
            [full_Name, user_mobile, username, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: "Registration successful."
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

app.post("/user-login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const result = await pool.query(
            `SELECT user_id, username, password
             FROM users
             WHERE username = $1`,
            [username]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        const user = result.rows[0];

        const passwordMatch = await BC.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const token = JWT.sign(
            {
                id: user.user_id,
                username: user.username
            },
            process.env.JWT_KEY,
            {
                expiresIn: "7d"
            }
        );


        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token
        });

    } catch (err) {
        console.error("Login Error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            user: {
                id: user.id,
                username: user.username
            }
        });
    }
});


const tokenVerify = async (req, res, next) => {
    const reqToken = req.headers.authorization;

    if (!reqToken) {
        return res.status(401).json({
            message: "No Token Found"
        })
    }

    const token = reqToken.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            message: "Invalid Token Format"
        })
    }

    try {
        const decode = JWT.verify(
            token,
            process.env.JWT_KEY
        )
        req.user = decode
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or Expired Token."
        });

    }

}

app.post("/add-gadgets", tokenVerify, async (req, res) => {
    try {
        const userID = req.user.id
        const { gadgetData } = req.body
        // console.log(gadgetData);

        if (!gadgetData || gadgetData.length === 0) {
            return res.status(400).json({
                message: "No Gadgets Received."
            });
        }

        for (const gadget of gadgetData) {
            await pool.query(`INSERT INTO gadgets (user_id, gadget_name, gadget_product_name, gadget_description) VALUES ($1,$2,$3,$4)`,
                [
                    userID,
                    gadget.name,
                    gadget.product_name,
                    gadget.description,
                ]

            );
        }

        return res.status(201).json({
            message: "Gadgets Saved Successfully"
        });
    } catch (err) {
        return res.status(500).json({
            // message: "Internal Server Error",
            message: err.message
        })
    }
});

app.get("/get-gadgets", tokenVerify, async (req, res) => {
    try {
        const userID = req.user.id
        const userData = await pool.query(`SELECT gadget_id, gadget_name, gadget_description, gadget_product_name, is_favorite FROM gadgets WHERE user_id = $1 ORDER BY gadget_id`, [userID])

        return res.status(200).json(
            userData.rows
        )
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }

});

app.delete("/gadget-delete", tokenVerify, async (req, res) => {

    try {

        const userID = req.user.id;
        const { selectedGadgets } = req.body;

        if (!selectedGadgets || selectedGadgets.length === 0) {
            return res.status(400).json({
                message: "No Gadgets Selected"
            });
        }

        await pool.query(
            `
            DELETE FROM gadgets

            WHERE user_id = $1

            AND gadget_id = ANY($2::int[])
            `,

            [
                userID,
                selectedGadgets
            ]

        );

        return res.status(200).json({
            message: "Gadgets Deleted Successfully"
        });

    }

    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

app.patch("/favorite-gadget-update", tokenVerify, async (req, res) => {
    try {

        const userID = req.user.id;
        const { selectedGadgets } = req.body;
        // console.log(selectedGadgets)

        if (!selectedGadgets || selectedGadgets.length === 0) {
            return res.status(400).json({
                message: "No Gadgets Selected"
            });
        }

        for (const g of selectedGadgets) {
            await pool.query(
                `
            UPDATE gadgets
            SET is_favorite = $1
            WHERE user_id =$2
            AND gadget_id = $3
            `,

                [
                    g.favorite,
                    userID,
                    g.gadget_id
                ]

            );
        }

        return res.status(200).json({
            message: "Added To Favorites"
        });

    }

    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
})

app.get("/favorite-gadget-only", tokenVerify, async (req, res) => {

    try {
        const userID = req.user.id
        const userData = await pool.query(
            `
            SELECT gadget_id, gadget_name, gadget_description, gadget_product_name, is_favorite
            FROM gadgets
            WHERE user_id =$1
            AND is_favorite = TRUE 
            `,

            [
                userID
            ]

        );

        return res.status(200).json(
            userData.rows
        )
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
})

// app.get("/test-db", async (req, res) => {
//     try {
//         const result = await pool.query("SELECT NOW()");
//         res.json({
//             success: true,
//             time: result.rows[0].now
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             error: err.message
//         });
//     }
// });

app.listen(PORT, () => {
    console.log("SERVER UP !!", PORT)
})