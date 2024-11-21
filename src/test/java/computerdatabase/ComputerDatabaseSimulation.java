package computerdatabase;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

//import java.util.concurrent.ThreadLocalRandom;

/**
 * This sample is based on our official tutorials:
 * <ul>
 *   <li><a href="https://docs.gatling.io/tutorials/recorder/">Gatling quickstart tutorial</a>
 *   <li><a href="https://docs.gatling.io/tutorials/advanced/">Gatling advanced tutorial</a>
 * </ul>
 */
public class ComputerDatabaseSimulation extends Simulation {

    ChainBuilder connect_as_user = exec(http("login_page").get("/login"))
        .pause(2)
        .exec(http("send_login").post("/api/authenticate").header("Content-Type", "application/json").body(RawFileBody("connect.json")))
        .pause(2);

    ChainBuilder validate = exec(http("home").get("/"))
        .pause(2)
        .exec(http("add_apple").post("/api/cart").header("Content-Type", "application/json").body(RawFileBody("cart.json")))
        .pause(1);

    HttpProtocolBuilder http_protocol = http.baseUrl("http://localhost:8080/").acceptHeader("text/html");
    ScenarioBuilder my_scenario = scenario("validate_cart").exec(connect_as_user, validate);

    {
        setUp(my_scenario.injectOpen(constantUsersPerSec(2).during(30))).protocols(http_protocol);
    }
}
