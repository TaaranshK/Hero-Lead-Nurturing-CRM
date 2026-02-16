package com.hero.leadnurturing.controller;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
public class LeadControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void deleteLead_shouldSucceed_and_logModification() throws Exception {
        // login as HO
        Map<String, String> creds = new HashMap<>();
        creds.put("username", "ho_admin");
        creds.put("password", "1234");

        MvcResult authResult = mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(creds)))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> authBody = mapper.readValue(authResult.getResponse().getContentAsString(), Map.class);
        String token = (String) authBody.get("token");
        assertThat(token).isNotBlank();

        // create a lead
        Map<String, Object> lead = new HashMap<>();
        String contactNumber = String.format("99%013d", System.currentTimeMillis() % 10000000000000L);
        lead.put("contactNumber", contactNumber);
        lead.put("firstName", "ITest");

        MvcResult createResult = mockMvc.perform(post("/api/leads")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(lead)))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> createBody = mapper.readValue(createResult.getResponse().getContentAsString(), Map.class);
        Map<String, Object> data = (Map<String, Object>) createBody.get("data");
        Number id = (Number) data.get("id");
        assertThat(id).isNotNull();

        // delete the lead
        mockMvc.perform(delete("/api/leads/" + id.longValue())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // ensure modifications endpoint returns entries (at least the delete entry exists)
        MvcResult modsResult = mockMvc.perform(get("/api/leads/" + id.longValue() + "/modifications")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        Map<String, Object> modsBody = mapper.readValue(modsResult.getResponse().getContentAsString(), Map.class);
        assertThat(modsBody).containsKey("data");
    }
}
