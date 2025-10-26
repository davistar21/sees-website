import React, {useState} from "react"

const Newsletter = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true)

    try{
      const response = await fetch ("https://sees-api.onrender.com/subscribers/", {
        method : "POST",
        headers : {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({email}),
      });

      if(response.status === 201){
        setMessage("Subscription successful! Thank you for subscribing");
        setEmail("")
        alert(message)
      }else if(response.status === 400){
         const data = await response.json();
        setMessage(`${data.detail || "Invalid email or already subscribed."}`);
        alert(message)
      } else {
        setMessage("Something went wrong. Please try again later.");
        alert(message)
      }
    }catch(error){
       setMessage("Network error. Please check your connection.");
       alert(message)
    }finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <div className="newsletter">
        <div className="form-container">
            <div className="subscribe">
                Subscribe to our Newsletter
            </div>
    <form onSubmit={handleSubmit}>
            <input 
            className="input"
            type="text" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email address"
            />

            <div className="subscribe-btn">
                <button type="submit" disabled={loading}>{loading ? "Subscribing..." : "Subscribe"}
                </button>
            </div>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Newsletter
