package com.je3l.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import com.je3l.domain.Aliment;
import com.je3l.repository.AlimentRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link Aliment} entity.
 */
public interface AlimentSearchRepository extends ElasticsearchRepository<Aliment, Long>, AlimentSearchRepositoryInternal {}

interface AlimentSearchRepositoryInternal {
    Stream<Aliment> search(String query);

    Stream<Aliment> search(Query query);

    @Async
    void index(Aliment entity);

    @Async
    void deleteFromIndexById(Long id);
}

class AlimentSearchRepositoryInternalImpl implements AlimentSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final AlimentRepository repository;

    AlimentSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, AlimentRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<Aliment> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<Aliment> search(Query query) {
        return elasticsearchTemplate.search(query, Aliment.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(Aliment entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), Aliment.class);
    }
}
