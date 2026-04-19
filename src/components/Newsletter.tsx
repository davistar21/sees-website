import React, { useState } from "react"
import { supabase } from "../lib/supabase"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")

    const { error } = await supabase
      .from("subscribers")
      .insert({ email })

    if (!error) {
      setStatus("success")
      setMessage("Subscribed! Thank you.")
      setEmail("")
    } else if (error.code === "23505") {
      // Unique constraint — already subscribed
      setStatus("error")
      setMessage("This email is already subscribed.")
    } else {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div>
      <div className="newsletter">
        <div className="form-container">
          <div className="subscribe">Subscribe to our Newsletter</div>
          <form onSubmit={handleSubmit}>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
            />
            <div className="subscribe-btn">
              <button type="submit" disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </form>
          {message && (
            <p className={`text-sm mt-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Newsletter
