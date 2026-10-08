package com.portfolio.service;

import com.portfolio.dto.request.AboutRequest;
import com.portfolio.dto.response.AboutResponse;

public interface AboutService {

    AboutResponse getAbout();

    AboutResponse updateAbout(AboutRequest request);
}
