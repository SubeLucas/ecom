package computerdatabase;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

public class ComputerDatabaseSimulation extends Simulation {

    ChainBuilder connect_as_user = exec(http("login_page").get("/login"))
        .pause(2)
        .exec(
            http("send_login")
                .post("/api/authenticate")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(RawFileBody("connect.json"))
                .check(status().is(200))
                .check(bodyString().saveAs("responseBody"))
                .check(jsonPath("$.id_token").saveAs("token"))
        )
        .pause(2)
        .exec(session -> {
            //System.out.println("Response Body: " + session.getString("responseBody"));
            //System.out.println("Token: " + session.getString("token"));
            return session;
        });

    ChainBuilder validate = exec(http("home").get("/"))
        .pause(2)
        .exec(
            http("add_grape")
                .post("/api/cart")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json, text/plain, */*")
                .header("Authorization", "Bearer #{token}")
                .body(RawFileBody("cart.json"))
        )
        .pause(1)
        .exec(
            http("send_credit_card")
                .post("/api/payment")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json, text/plain, */*")
                .header("Authorization", "Bearer #{token}")
                .body(RawFileBody("payment.json"))
        )
        .pause(1);

    HttpProtocolBuilder http_protocol = http.baseUrl("http://localhost:8080/").acceptHeader("text/html");
    ScenarioBuilder my_scenario = scenario("validate_cart").exec(connect_as_user, validate);

    {
        setUp(my_scenario.injectOpen(constantUsersPerSec(3).during(60))).protocols(http_protocol);
    }
}
